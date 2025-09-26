import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
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

    let query;

    if (type === 'created') {
      // Заказы, которые создал пользователь
      query = supabase
        .from('orders')
        .select(`
          *,
          creator:users!orders_creator_id_fkey(telegram_id, username),
          executor:users!orders_executor_id_fkey(telegram_id, username)
        `)
        .eq('creator_id', user_id)
        .order('created_at', { ascending: false });
    } else if (type === 'executing') {
      // Заказы, которые выполняет пользователь
      query = supabase
        .from('orders')
        .select(`
          *,
          creator:users!orders_creator_id_fkey(telegram_id, username),
          executor:users!orders_executor_id_fkey(telegram_id, username)
        `)
        .eq('executor_id', user_id)
        .order('created_at', { ascending: false });
    } else {
      // Все заказы пользователя
      query = supabase
        .from('orders')
        .select(`
          *,
          creator:users!orders_creator_id_fkey(telegram_id, username),
          executor:users!orders_executor_id_fkey(telegram_id, username)
        `)
        .or(`creator_id.eq.${user_id},executor_id.eq.${user_id}`)
        .order('created_at', { ascending: false });
    }

    const { data: orders, error } = await query;

    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Ошибка при загрузке заказов',
      } as ApiResponse<null>, { status: 500 });
    }

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
