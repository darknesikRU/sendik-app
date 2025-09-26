import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse, Order } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const from_location = searchParams.get('from_location');
    const to_location = searchParams.get('to_location');
    const delivery_date_from = searchParams.get('delivery_date_from');
    const delivery_date_to = searchParams.get('delivery_date_to');
    const search = searchParams.get('search');

    // Строим условия для фильтрации
    const where: any = {};
    
    if (status) {
      where.status = status.toUpperCase();
    }
    if (from_location) {
      where.from_location = { contains: from_location, mode: 'insensitive' };
    }
    if (to_location) {
      where.to_location = { contains: to_location, mode: 'insensitive' };
    }
    if (delivery_date_from) {
      where.delivery_date = { gte: new Date(delivery_date_from) };
    }
    if (delivery_date_to) {
      where.delivery_date = { ...where.delivery_date, lte: new Date(delivery_date_to) };
    }
    if (search) {
      where.OR = [
        { description: { contains: search, mode: 'insensitive' } },
        { from_location: { contains: search, mode: 'insensitive' } },
        { to_location: { contains: search, mode: 'insensitive' } },
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
    } as ApiResponse<Order[]>);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Внутренняя ошибка сервера',
    } as ApiResponse<null>, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      from_location, 
      to_location, 
      description, 
      price, 
      delivery_date, 
      weight_kg, 
      image_urls = [],
      creator_id 
    } = body;

    // Валидация обязательных полей
    if (!from_location || !to_location || !description || !price || !delivery_date || !weight_kg || !creator_id) {
      return NextResponse.json({
        success: false,
        error: 'Все обязательные поля должны быть заполнены',
      } as ApiResponse<null>, { status: 400 });
    }

    // Валидация цены
    if (price < 0) {
      return NextResponse.json({
        success: false,
        error: 'Цена не может быть отрицательной',
      } as ApiResponse<null>, { status: 400 });
    }

    // Валидация веса
    if (weight_kg <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Вес должен быть больше 0',
      } as ApiResponse<null>, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        creator_id,
        from_location,
        to_location,
        description,
        price,
        delivery_date: new Date(delivery_date),
        weight_kg,
        image_urls,
        status: 'NEW',
      },
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

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Внутренняя ошибка сервера',
    } as ApiResponse<null>, { status: 500 });
  }
}
