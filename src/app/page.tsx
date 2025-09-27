'use client';

import { useState } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { OrderCard } from '@/components/OrderCard';
import { OrderFilters } from '@/components/OrderFilters';
import { Package, Loader2 } from 'lucide-react';

export default function Home() {
  const [filters, setFilters] = useState({
    search: '',
    from_location: '',
    to_location: '',
    delivery_date_from: '',
    delivery_date_to: '',
  });

  const handleFiltersChange = (newFilters: {
    search?: string;
    from_location?: string;
    to_location?: string;
    delivery_date_from?: string;
    delivery_date_to?: string;
  }) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
    }));
  };

  const { orders, loading, error } = useOrders({
    ...filters,
    status: 'new', // Показываем только новые заказы
  });

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Ошибка загрузки заказов: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <OrderFilters onFiltersChange={handleFiltersChange} />
      
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Загрузка заказов...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Заказов пока нет
            </h3>
            <p className="text-gray-600">
              Станьте первым, кто создаст заказ на доставку!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Доступные заказы ({Array.isArray(orders) ? orders.length : 0})
              </h2>
            </div>
            
            <div className="grid gap-4">
              {Array.isArray(orders) && orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
