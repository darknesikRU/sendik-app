'use client';

import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderFiltersProps {
  onFiltersChange: (filters: {
    search?: string;
    from_location?: string;
    to_location?: string;
    delivery_date_from?: string;
    delivery_date_to?: string;
  }) => void;
}

export function OrderFilters({ onFiltersChange }: OrderFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    from_location: '',
    to_location: '',
    delivery_date_from: '',
    delivery_date_to: '',
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      search: '',
      from_location: '',
      to_location: '',
      delivery_date_from: '',
      delivery_date_to: '',
    };
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск по описанию или направлению..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              'p-2 rounded-lg border transition-colors',
              isOpen
                ? 'bg-blue-50 border-blue-200 text-blue-600'
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
            )}
          >
            <Filter className="h-4 w-4" />
          </button>
        </div>

        {isOpen && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Откуда
                </label>
                <input
                  type="text"
                  placeholder="Город отправления"
                  value={filters.from_location}
                  onChange={(e) => handleFilterChange('from_location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Куда
                </label>
                <input
                  type="text"
                  placeholder="Город назначения"
                  value={filters.to_location}
                  onChange={(e) => handleFilterChange('to_location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Дата от
                </label>
                <input
                  type="date"
                  value={filters.delivery_date_from}
                  onChange={(e) => handleFilterChange('delivery_date_from', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Дата до
                </label>
                <input
                  type="date"
                  value={filters.delivery_date_to}
                  onChange={(e) => handleFilterChange('delivery_date_to', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex justify-end">
                <button
                  onClick={clearFilters}
                  className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                  <span>Очистить фильтры</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
