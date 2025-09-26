'use client';

import { useEffect } from 'react';
import { initTelegramWebApp } from '@/lib/telegram';

interface TelegramProviderProps {
  children: React.ReactNode;
}

export function TelegramProvider({ children }: TelegramProviderProps) {
  useEffect(() => {
    // Инициализируем Telegram WebApp при загрузке
    const tg = initTelegramWebApp();
    
    if (tg) {
      console.log('Telegram WebApp инициализирован');
      
      // Настройка кнопки назад
      tg.BackButton.onClick(() => {
        window.history.back();
      });
      
      // Настройка главной кнопки
      tg.MainButton.setText('Создать заказ');
      tg.MainButton.onClick(() => {
        window.location.href = '/create-order';
      });
    } else {
      console.log('Telegram WebApp не доступен (работаем в браузере)');
    }
  }, []);

  return <>{children}</>;
}
