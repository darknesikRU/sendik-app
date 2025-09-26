import { useState, useEffect } from 'react';
import { Response } from '@/types';
import { api } from '@/lib/api';

export function useResponses(orderId?: string) {
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResponses = async (id?: string) => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = id ? `/orders/${id}/responses` : '/responses';
      const response = await api.get<Response[]>(endpoint);

      if (response.success && response.data) {
        setResponses(response.data);
      } else {
        setError(response.error || 'Ошибка загрузки откликов');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchResponses(orderId);
    }
  }, [orderId]);

  const createResponse = async (orderId: string) => {
    try {
      const response = await api.post<Response>(`/orders/${orderId}/responses`, {});

      if (response.success && response.data) {
        setResponses(prev => [response.data!, ...prev]);
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

  const updateResponse = async (responseId: string, status: 'accepted' | 'rejected') => {
    try {
      const response = await api.patch<Response>(`/responses/${responseId}`, { status });

      if (response.success && response.data) {
        setResponses(prev => 
        prev.map(resp => 
          resp.id === responseId ? response.data! : resp
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

  const deleteResponse = async (responseId: string) => {
    try {
      const response = await api.delete(`/responses/${responseId}`);

      if (response.success) {
        setResponses(prev => prev.filter(resp => resp.id !== responseId));
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
    responses,
    loading,
    error,
    fetchResponses,
    createResponse,
    updateResponse,
    deleteResponse,
  };
}
