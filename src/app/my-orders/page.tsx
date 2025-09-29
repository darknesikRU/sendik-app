'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { Order } from '@/types';
import { OrderCard } from '@/components/OrderCard';
import { Package, Loader2 } from 'lucide-react';

export default function MyOrdersPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'created' | 'executing'>('created');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/my-orders?user_id=${user.telegramId}&type=${activeTab}`);
        const data = await response.json();

        if (data.success) {
          setOrders(data.data || []);
        } else {
          setError(data.error || 'Ошибка загрузки заказов');
        }
      } catch (err) {
        setError('Неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, activeTab]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Необходимо войти в систему</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Мои заказы</h1>

          {/* Вкладки */}
          <div className="bg-white rounded-lg border border-gray-200 mb-6">
            <div className="flex">
              <button
                onClick={() => setActiveTab('created')}
                className={`flex-1 py-3 px-4 text-center font-medium rounded-l-lg transition-colors ${
                  activeTab === 'created'
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Отправляю
              </button>
              <button
                onClick={() => setActiveTab('executing')}
                className={`flex-1 py-3 px-4 text-center font-medium rounded-r-lg transition-colors ${
                  activeTab === 'executing'
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Доставляю
              </button>
            </div>
          </div>

          {/* Контент */}
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Загрузка заказов...</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeTab === 'created' ? 'У вас нет созданных заказов' : 'Вы не выполняете заказы'}
              </h3>
              <p className="text-gray-600">
                {activeTab === 'created' 
                  ? 'Создайте свой первый заказ на доставку!'
                  : 'Найдите подходящий заказ на главной странице'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  {activeTab === 'created' ? 'Созданные заказы' : 'Выполняемые заказы'} ({orders.length})
                </h2>
              </div>
              
              <div className="grid gap-4">
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} showActions={false} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


