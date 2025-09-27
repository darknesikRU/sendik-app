'use client';

import { useEffect, useState } from 'react';
import { initTelegramWebApp, getTelegramWebApp } from '@/lib/telegram';

interface TelegramProviderProps {
  children: React.ReactNode;
}

export function TelegramProvider({ children }: TelegramProviderProps) {
  const [isTelegramReady, setIsTelegramReady] = useState(false);
  const [loadingText, setLoadingText] = useState('Загружаем приложение...');

  useEffect(() => {
    const checkTelegram = () => {
      const tg = getTelegramWebApp();
      if (tg) {
        setLoadingText('Инициализируем Telegram...');
        initTelegramWebApp();
        setIsTelegramReady(true);
        return true;
      }
      return false;
    };

    // Анимация загрузки с этапами
    const loadSteps = [
      'Подключаемся к Telegram...',
      'Загружаем данные...', 
      'Почти готово...'
    ];

    let step = 0;
    const textInterval = setInterval(() => {
      setLoadingText(loadSteps[step]);
      step = (step + 1) % loadSteps.length;
    }, 1000);

    // Проверяем Telegram
    if (checkTelegram()) {
      clearInterval(textInterval);
      return;
    }

    const telegramInterval = setInterval(() => {
      if (checkTelegram()) {
        clearInterval(telegramInterval);
        clearInterval(textInterval);
      }
    }, 100);

    setTimeout(() => {
      clearInterval(telegramInterval);
      clearInterval(textInterval);
      if (!isTelegramReady) {
        setLoadingText('Переходим в режим браузера...');
        setIsTelegramReady(true); // Все равно показываем интерфейс
      }
    }, 5000);

    return () => {
      clearInterval(telegramInterval);
      clearInterval(textInterval);
    };
  }, []);

  if (!isTelegramReady) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        {/* Пульсирующий логотип вместо спиннера */}
        <div className="animate-pulse bg-blue-600 rounded-full h-20 w-20 mx-auto mb-4"></div>
        
        {/* Спиннер */}
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        
        {/* Текст с плавным переходом */}
        <p className="text-gray-600 animate-pulse">{loadingText}</p>
        
        {/* Прогресс-бар */}
        <div className="w-48 bg-gray-200 rounded-full h-2 mt-4 mx-auto">
          <div className="bg-blue-600 h-2 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

  return <>{children}</>;
}
