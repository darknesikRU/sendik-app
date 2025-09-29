'use client';

import { useTelegramUser } from '@/hooks/useTelegramUser';
import Script from 'next/script';

interface TelegramProviderProps {
  children: React.ReactNode;
}

export function TelegramProvider({ children }: TelegramProviderProps) {
  const { isLoading, error } = useTelegramUser();

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
  }

  return (
    <>
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="afterInteractive"
      />
      {children}
    </>
  );
}