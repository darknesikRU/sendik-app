import { TelegramWebApp, TelegramUser } from '@/types';

// Получение экземпляра Telegram WebApp
export const getTelegramWebApp = (): TelegramWebApp | null => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp;
  }
  return null;
};

// Получение данных пользователя из Telegram
export const getTelegramUser = (): TelegramUser | null => {
  const tg = getTelegramWebApp();
  return tg?.initDataUnsafe?.user || null;
};

// Валидация initData (базовая проверка)
export const validateTelegramData = (initData: string): boolean => {
  // В реальном приложении здесь должна быть проверка подписи
  // Для MVP пока просто проверяем наличие данных
  return initData.length > 0;
};

// Инициализация Telegram WebApp
export const initTelegramWebApp = () => {
  const tg = getTelegramWebApp();
  if (tg) {
    tg.ready();
    tg.expand();
    
    // Настройка темы
    if (tg.colorScheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
    
    return tg;
  }
  return null;
};

// Получение данных пользователя для API
export const getTelegramUserData = () => {
  const tg = getTelegramWebApp();
  const user = getTelegramUser();
  
  if (!user || !tg) {
    return null;
  }
  
  return {
    telegram_id: user.id.toString(),
    username: user.username || null,
    first_name: user.first_name,
    last_name: user.last_name,
  };
};

