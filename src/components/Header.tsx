'use client';

import { useUser } from '@/hooks/useUser';
import { Package, User } from 'lucide-react';

export function Header() {
  const { user, loading } = useUser();

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Package className="h-6 w-6 text-blue-600" />
          <h1 className="text-lg font-semibold text-gray-900">Sendik</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          {loading ? (
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
          ) : user ? (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-sm text-gray-700">
                {user.username || 'Пользователь'}
              </span>
            </div>
          ) : (
            <div className="w-8 h-8 bg-gray-200 rounded-full" />
          )}
        </div>
      </div>
    </header>
  );
}


