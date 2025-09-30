'use client';

import { useEffect } from 'react';
import { useTelegramUser } from '@/hooks/useTelegramUser';

interface TelegramProviderProps {
  children: React.ReactNode;
}

export function TelegramProvider({ children }: TelegramProviderProps) {
  const { isLoading, error } = useTelegramUser();

  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.expand();
      console.log("WebApp initialized:", {
        user: tg.initDataUnsafe?.user,
        platform: tg.platform,
      });
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-pulse bg-blue-600 rounded-full h-20 w-20 mx-auto mb-4"></div>
          <p className="text-gray-600 animate-pulse">Загружаем приложение...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Telegram initialization error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="bg-red-100 rounded-full h-20 w-20 mx-auto mb-4 flex items-center justify-center">
            <span className="text-red-600">⚠️</span>
          </div>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
