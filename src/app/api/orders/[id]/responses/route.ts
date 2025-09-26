import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { ApiResponse, Response } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const { data: responses, error } = await supabase
      .from('responses')
      .select(`
        *,
        deliverer:users!responses_deliverer_id_fkey(telegram_id, username)
      `)
      .eq('order_id', id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Ошибка при загрузке откликов',
      } as ApiResponse<null>, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: responses || [],
    } as ApiResponse<Response[]>);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Внутренняя ошибка сервера',
    } as ApiResponse<null>, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { deliverer_id } = body;

    if (!deliverer_id) {
      return NextResponse.json({
        success: false,
        error: 'deliverer_id обязателен',
      } as ApiResponse<null>, { status: 400 });
    }

    // Проверяем, существует ли заказ
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, creator_id')
      .eq('id', id)
      .single();

    if (orderError || !order) {
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
    const { data: existingResponse, error: checkError } = await supabase
      .from('responses')
      .select('id')
      .eq('order_id', id)
      .eq('deliverer_id', deliverer_id)
      .single();

    if (existingResponse) {
      return NextResponse.json({
        success: false,
        error: 'Вы уже откликнулись на этот заказ',
      } as ApiResponse<null>, { status: 400 });
    }

    const { data: response, error } = await supabase
      .from('responses')
      .insert({
        order_id: id,
        deliverer_id,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Ошибка при создании отклика',
      } as ApiResponse<null>, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: response,
    } as ApiResponse<Response>);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Внутренняя ошибка сервера',
    } as ApiResponse<null>, { status: 500 });
  }
}
