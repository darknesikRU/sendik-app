import { useState, useEffect } from 'react';
import { Order } from '@/types';
import { api } from '@/lib/api';

interface OrdersFilters {
  status?: string;
  from_location?: string;
  to_location?: string;
  delivery_date_from?: string;
  delivery_date_to?: string;
  search?: string;
}

export function useOrders(filters: OrdersFilters = {}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await api.get<Order[]>(`/orders?${queryParams.toString()}`);

      if (response.success && response.data) {
        setOrders(response.data);
      } else {
        setError(response.error || 'Ошибка загрузки заказов');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [JSON.stringify(filters)]);

  const createOrder = async (orderData: Omit<Order, 'id' | 'created_at' | 'creator_id'>, creatorId: string) => {
    try {
      const response = await api.post<Order>('/orders', { ...orderData, creator_id: creatorId });

      if (response.success && response.data) {
        setOrders(prev => [response.data!, ...prev]);
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Неизвестная ошибка' 
      };
    }
  };

  const updateOrder = async (orderId: string, updates: Partial<Order>) => {
    try {
      const response = await api.patch<Order>(`/orders/${orderId}`, updates);

      if (response.success && response.data) {
        setOrders(prev => 
        prev.map(order => 
          order.id === orderId ? response.data! : order
        ));
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Неизвестная ошибка' 
      };
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      const response = await api.delete(`/orders/${orderId}`);

      if (response.success) {
        setOrders(prev => prev.filter(order => order.id !== orderId));
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Неизвестная ошибка' 
      };
    }
  };

  return {
    orders,
    loading,
    error,
    fetchOrders,
    createOrder,
    updateOrder,
    deleteOrder,
  };
}
