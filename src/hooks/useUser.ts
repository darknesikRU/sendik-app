import { useState, useEffect } from 'react';
import { User } from '@/types';
import { getTelegramWebApp, getTelegramUserData } from '@/lib/telegram';
import { api } from '@/lib/api';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let intervalId: NodeJS.Timeout | null = null;

    const initUser = async () => {
      try {
        setLoading(true);
        setError(null);

        // Ожидаем инициализации Telegram.WebApp
        const waitForTelegram = () => {
          return new Promise<void>((resolve, reject) => {
            const maxAttempts = 50; // Максимум 5 секунд ожидания (100мс * 50)
            let attempts = 0;

            intervalId = setInterval(() => {
              attempts++;
              const tg = getTelegramWebApp();
              if (tg) {
                if (intervalId) clearInterval(intervalId);
                resolve();
              } else if (attempts >= maxAttempts) {
                if (intervalId) clearInterval(intervalId);
                reject(new Error('Telegram.WebApp не инициализирован'));
              }
            }, 100);
          });
        };

        await waitForTelegram();

        // Получаем данные пользователя из Telegram
        const telegramUserData = getTelegramUserData();

        if (!telegramUserData) {
          if (mounted) {
            setError('Не удалось получить данные пользователя из Telegram');
            setLoading(false);
          }
          return;
        }

        // Синхронизируем пользователя с сервером
        const response = await api.post<User>('/users/sync', {
          telegram_id: telegramUserData.telegram_id,
          username: telegramUserData.username,
        });

        if (mounted) {
          if (response.success && response.data) {
            setUser(response.data);
          } else {
            setError(response.error || 'Ошибка синхронизации пользователя');
          }
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initUser();

    return () => {
      mounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
  };
}