import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse, Order } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    const type = searchParams.get('type'); // 'created' или 'executing'

    if (!user_id) {
      return NextResponse.json({
        success: false,
        error: 'user_id обязателен',
      } as ApiResponse<null>, { status: 400 });
    }

    const where: Record<string, unknown> = {};

    if (type === 'created') {
      // Заказы, которые создал пользователь
      where.creator_id = user_id;
    } else if (type === 'executing') {
      // Заказы, которые выполняет пользователь
      where.executor_id = user_id;
    } else {
      // Все заказы пользователя
      where.OR = [
        { creator_id: user_id },
        { executor_id: user_id }
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        creator: {
          select: {
            telegram_id: true,
            username: true,
          },
        },
        executor: {
          select: {
            telegram_id: true,
            username: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: orders || [],
    } as unknown as ApiResponse<Order[]>);

  } catch (err) {
    console.error('Error in my-orders GET:', err);
    return NextResponse.json({
      success: false,
      error: 'Внутренняя ошибка сервера',
    } as ApiResponse<null>, { status: 500 });
  }
}