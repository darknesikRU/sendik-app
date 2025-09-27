import { useState, useEffect } from 'react';
import { User } from '@/types';
import { getTelegramUserData } from '@/lib/telegram';
import { api } from '@/lib/api';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initUser = async () => {
      try {
        setLoading(true);
        setError(null);

        // Ждем некоторое время, чтобы TelegramProvider успел инициализироваться
        await new Promise(resolve => setTimeout(resolve, 1000));

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
    };
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
  };
}