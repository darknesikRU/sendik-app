import { TelegramWebApp} from '@/types';

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
  if (tg) {
    // Сообщаем Telegram, что приложение готово
    tg.ready();
    // Раскрываем веб-приложение на весь экран
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
  try {
    const tg = getTelegramWebApp();
    
    if (!tg) {
      throw new Error('Telegram WebApp не доступен');
    }

    const user = tg.initDataUnsafe?.user;
    if (!user) {
      throw new Error('Данные пользователя Telegram не найдены');
    }

    // Возвращаем только необходимые данные
    return {
      telegram_id: user.id.toString(),
      username: user.username || null,
      first_name: user.first_name,
      last_name: user.last_name
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


