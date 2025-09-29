import { TelegramWebApp } from '@/types';

// Получение экземпляра Telegram WebApp
export const getTelegramWebApp = (): TelegramWebApp | null => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp;
  }
  return null;
};


// Инициализация Telegram WebApp
export const initTelegramWebApp = () => {
  const tg = getTelegramWebApp();
  if (!tg) {
    console.warn('Telegram.WebApp не доступен. Возможно, приложение не запущено в Telegram.');
    return null;
  }

  // Сообщаем Telegram, что приложение готово
  tg.ready();
  // Раскрываем веб-приложение на весь экран
  tg.expand();

  // Настройка темы
  if (tg.colorScheme === 'dark') {
    document.documentElement.classList.add('telegram-dark');
  }

  // Обработка изменения темы
  tg.onEvent('themeChanged', () => {
    document.documentElement.classList.toggle('telegram-dark', tg.colorScheme === 'dark');
  });

  return tg;
};

// Получение данных пользователя для API
export const getTelegramUserData = () => {
  try {
    const tg = getTelegramWebApp();
    if (!tg) {
      console.warn('Telegram.WebApp не доступен');
      return null;
    }

    const user = tg.initDataUnsafe?.user;
    if (!user) {
      console.warn('Данные пользователя Telegram не найдены');
      return null;
    }

    // Возвращаем только необходимые данные
    return {
      telegram_id: user.id.toString(),
      username: user.username || null,
      first_name: user.first_name,
      last_name: user.last_name || undefined,
    };
  } catch (error) {
    console.error('Ошибка получения данных пользователя Telegram:', error);
    return null;
  }
};

// Валидация initData
export const validateTelegramData = (initData: string): boolean => {
  return Boolean(initData && initData.length > 0);
};


