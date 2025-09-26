'use client';

import Link from 'next/link';
import { Order } from '@/types';
import { formatPrice, formatDate, formatWeight } from '@/lib/utils';
import { MapPin, Calendar, Weight, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderCardProps {
  order: Order;
  showActions?: boolean;
}

export function OrderCard({ order, showActions = true }: OrderCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new':
        return 'Новый';
      case 'in_progress':
        return 'В работе';
      case 'completed':
        return 'Завершен';
      case 'cancelled':
        return 'Отменен';
      default:
        return status;
    }
  };

  return (
    <Link href={`/order/${order.id}`}>
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {order.from_location} → {order.to_location}
              </span>
            </div>
            <p className="text-gray-900 font-medium line-clamp-2">
              {order.description}
            </p>
          </div>
          <span className={cn(
            'px-2 py-1 rounded-full text-xs font-medium',
            getStatusColor(order.status)
          )}>
            {getStatusText(order.status)}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(order.delivery_date)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Weight className="h-4 w-4" />
              <span>{formatWeight(order.weight_kg)}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <DollarSign className="h-4 w-4" />
            <span className="font-semibold text-green-600">
              {formatPrice(order.price)}
            </span>
          </div>
        </div>

        {order.image_urls && order.image_urls.length > 0 && (
          <div className="flex space-x-2 mb-3">
            {order.image_urls.slice(0, 3).map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Изображение ${index + 1}`}
                className="w-12 h-12 object-cover rounded"
              />
            ))}
            {order.image_urls.length > 3 && (
              <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-xs text-gray-500">
                  +{order.image_urls.length - 3}
                </span>
              </div>
            )}
          </div>
        )}

        {showActions && order.status === 'new' && (
          <div className="pt-3 border-t border-gray-100">
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Откликнуться
            </button>
          </div>
        )}
      </div>
    </Link>
  );
}

