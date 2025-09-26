import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse, User } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { telegram_id, username } = body;

    if (!telegram_id) {
      return NextResponse.json({
        success: false,
        error: 'telegram_id обязателен',
      } as ApiResponse<null>, { status: 400 });
    }

    // Используем upsert для создания или обновления пользователя
    const user = await prisma.user.upsert({
      where: { telegram_id },
      update: { username },
      create: {
        telegram_id,
        username,
      },
    });

    return NextResponse.json({
      success: true,
      data: user,
    } as ApiResponse<User>);

  } catch (error) {
    console.error('Error in users/sync:', error);
    return NextResponse.json({
      success: false,
      error: 'Внутренняя ошибка сервера',
    } as ApiResponse<null>, { status: 500 });
  }
}
