import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse, Order } from '@/types';
import { Prisma, OrderStatus } from '@prisma/client';

type OrderWhereInput = {
  status?: OrderStatus;
  from_location?: { contains: string; mode: 'insensitive' };
  to_location?: { contains: string; mode: 'insensitive' };
  delivery_date?: {
    gte?: Date;
    lte?: Date;
  };
  OR?: {
    [key: string]: { contains: string; mode: 'insensitive' };
  }[];
};

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
    const where: OrderWhereInput = {};
    
    if (status) {
      where.status = status as OrderStatus;
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

    console.log('Orders found:', orders.length);
    console.log('Orders data:', orders);

    return NextResponse.json({
      success: true,
      data: orders || [],
    });

  } catch (err) {
    console.error('Error in orders GET:', err);

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Prisma error code:', err.code);
      console.error('Prisma error message:', err.message);
    } else if (err instanceof Prisma.PrismaClientValidationError) {
      console.error('Prisma validation error:', err.message);
    } else {
      console.error('Unexpected error:', err);
    }

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
    } as unknown as ApiResponse<Order>);

  } catch (err) {
    console.error('Error in orders POST:', err);

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Prisma error code:', err.code);
      console.error('Prisma error message:', err.message);
    } else if (err instanceof Prisma.PrismaClientValidationError) {
      console.error('Prisma validation error:', err.message);
    } else {
      console.error('Unexpected error:', err);
    }

    return NextResponse.json({
      success: false,
      error: 'Внутренняя ошибка сервера',
    } as ApiResponse<null>, { status: 500 });
  }
}