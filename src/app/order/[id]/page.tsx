'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { useResponses } from '@/hooks/useResponses';
import { formatPrice, formatDate, formatWeight } from '@/lib/utils';
import { MapPin, Calendar, Weight, DollarSign, User, CheckCircle, XCircle } from 'lucide-react';

interface OrderWithDetails {
  id: string;
  creator_id: string;
  executor_id: string | null;
  from_location: string;
  to_location: string;
  description: string;
  price: number;
  status: string;
  delivery_date: string;
  weight_kg: number;
  image_urls: string[];
  created_at: string;
  creator: {
    telegram_id: string;
    username: string | null;
  };
  executor?: {
    telegram_id: string;
    username: string | null;
  };
}

export default function OrderPage() {
  const params = useParams();
  const { user } = useUser();
  const { responses, createResponse, updateResponse } = useResponses(params.id as string);
  
  const [order, setOrder] = useState<OrderWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [responding, setResponding] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${params.id}`);
        const data = await response.json();
        
        if (data.success) {
          setOrder(data.data);
        } else {
          setError(data.error || 'Ошибка загрузки заказа');
        }
      } catch (err) {
        setError('Неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchOrder();
    }
  }, [params.id]);

  const handleResponse = async () => {
    if (!user || !order) return;

    setResponding(true);
    try {
      const result = await createResponse(order.id);
      if (result.success) {
        // Обновляем статус заказа или показываем уведомление
        alert('Отклик отправлен!');
      } else {
        alert(result.error || 'Ошибка отправки отклика');
      }
    } catch (err) {
      alert('Неизвестная ошибка');
    } finally {
      setResponding(false);
    }
  };

  const handleAcceptResponse = async (responseId: string) => {
    try {
      const result = await updateResponse(responseId, 'accepted');
      if (result.success) {
        // Обновляем заказ
        window.location.reload();
      } else {
        alert(result.error || 'Ошибка принятия отклика');
      }
    } catch (err) {
      alert('Неизвестная ошибка');
    }
  };

  const handleRejectResponse = async (responseId: string) => {
    try {
      const result = await updateResponse(responseId, 'rejected');
      if (result.success) {
        // Обновляем список откликов
        window.location.reload();
      } else {
        alert(result.error || 'Ошибка отклонения отклика');
      }
    } catch (err) {
      alert('Неизвестная ошибка');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка заказа...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Заказ не найден'}</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Назад
          </button>
        </div>
      </div>
    );
  }

  const isCreator = user?.telegramId === order.creator_id;
  const canRespond = !isCreator && order.status === 'new' && user;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  Заказ на доставку
                </h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'new' ? 'bg-green-100 text-green-800' :
                  order.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {order.status === 'new' ? 'Новый' :
                   order.status === 'in_progress' ? 'В работе' :
                   order.status === 'completed' ? 'Завершен' : 'Отменен'}
                </span>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <span className="text-lg font-medium text-gray-900">
                      {order.from_location} → {order.to_location}
                    </span>
                  </div>
                  <p className="text-gray-700">{order.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Дата доставки</p>
                      <p className="font-medium">{formatDate(order.delivery_date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Weight className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Вес</p>
                      <p className="font-medium">{formatWeight(order.weight_kg)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Цена</p>
                      <p className="font-medium text-green-600">{formatPrice(order.price)}</p>
                    </div>
                  </div>
                </div>

                {order.image_urls && order.image_urls.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Фотографии</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {order.image_urls.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Изображение ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <User className="h-5 w-5 text-gray-500" />
                    <h3 className="text-lg font-medium text-gray-900">
                      Информация о заказчике
                    </h3>
                  </div>
                  <p className="text-gray-700">
                    @{order.creator.username || 'Пользователь'}
                  </p>
                </div>

                {canRespond && (
                  <div className="border-t border-gray-200 pt-6">
                    <button
                      onClick={handleResponse}
                      disabled={responding}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {responding ? 'Отправка...' : 'Откликнуться на заказ'}
                    </button>
                  </div>
                )}

                {isCreator && responses.length > 0 && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Отклики ({responses.length})
                    </h3>
                    <div className="space-y-3">
                      {responses.map((response) => (
                        <div key={response.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">
                                @{(response as { deliverer?: { username?: string } }).deliverer?.username || 'Пользователь'}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatDate(response.created_at)}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleAcceptResponse(response.id)}
                                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleRejectResponse(response.id)}
                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
