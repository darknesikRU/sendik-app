import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse, Response } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const responses = await prisma.response.findMany({
      where: { order_id: id },
      include: {
        deliverer: {
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
      data: responses || [],
    } as ApiResponse<Response[]>);

  } catch (err) {
    console.error('Error in responses GET:', err);
    return NextResponse.json({
      success: false,
      error: 'Внутренняя ошибка сервера',
    } as ApiResponse<null>, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { deliverer_id } = body;

    if (!deliverer_id) {
      return NextResponse.json({
        success: false,
        error: 'deliverer_id обязателен',
      } as ApiResponse<null>, { status: 400 });
    }

    // Проверяем, существует ли заказ
    const order = await prisma.order.findUnique({
      where: { id },
      select: { id: true, creator_id: true },
    });

    if (!order) {
      return NextResponse.json({
        success: false,
        error: 'Заказ не найден',
      } as ApiResponse<null>, { status: 404 });
    }

    // Проверяем, что пользователь не создатель заказа
    if (order.creator_id === deliverer_id) {
      return NextResponse.json({
        success: false,
        error: 'Нельзя откликнуться на свой заказ',
      } as ApiResponse<null>, { status: 400 });
    }

    // Проверяем, не откликался ли уже пользователь
    const existingResponse = await prisma.response.findUnique({
      where: {
        order_id_deliverer_id: {
          order_id: id,
          deliverer_id,
        },
      },
    });

    if (existingResponse) {
      return NextResponse.json({
        success: false,
        error: 'Вы уже откликнулись на этот заказ',
      } as ApiResponse<null>, { status: 400 });
    }

    const response = await prisma.response.create({
      data: {
        order_id: id,
        deliverer_id,
        status: 'PENDING',
      },
      include: {
        deliverer: {
          select: {
            telegram_id: true,
            username: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: response,
    } as ApiResponse<Response>);

  } catch (err) {
    console.error('Error in responses POST:', err);
    return NextResponse.json({
      success: false,
      error: 'Внутренняя ошибка сервера',
    } as ApiResponse<null>, { status: 500 });
  }
}