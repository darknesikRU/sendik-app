import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse, Order } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
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
    });

    if (!order) {
      return NextResponse.json({
        success: false,
        error: 'Заказ не найден',
      } as ApiResponse<null>, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: order,
    } as ApiResponse<Order>);

  } catch (err) {
    console.error('Error in orders GET by id:', err);
    return NextResponse.json({
      success: false,
      error: 'Внутренняя ошибка сервера',
    } as ApiResponse<null>, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const order = await prisma.order.update({
      where: { id },
      data: body,
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
    });

    return NextResponse.json({
      success: true,
      data: order,
    } as ApiResponse<Order>);

  } catch (err) {
    console.error('Error in orders PATCH:', err);
    return NextResponse.json({
      success: false,
      error: 'Внутренняя ошибка сервера',
    } as ApiResponse<null>, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.order.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      data: null,
    } as ApiResponse<null>);

  } catch (err) {
    console.error('Error in orders DELETE:', err);
    return NextResponse.json({
      success: false,
      error: 'Внутренняя ошибка сервера',
    } as ApiResponse<null>, { status: 500 });
  }
}