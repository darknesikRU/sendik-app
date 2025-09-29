import { useState, useEffect } from 'react';
import { User } from '@/types';
import { useTelegramUser } from './useTelegramUser';
import { api } from '@/lib/api';

export function useUser() {
  const { user: telegramUser, isLoading: telegramLoading, error: telegramError } = useTelegramUser();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initUser = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!telegramUser) {
          throw new Error(telegramError || 'Не удалось получить данные пользователя из Telegram');
        }

        // Синхронизируем пользователя с сервером
        const response = await api.post<User>('/users/sync', {
          telegram_id: telegramUser.id.toString(),
          username: telegramUser.username,
        });

        if (response.success && response.data) {
          setUser(response.data);
        } else {
          setError(response.error || 'Ошибка синхронизации пользователя');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    };

    if (!telegramLoading) {
      initUser();
    }
  }, [telegramUser, telegramLoading, telegramError]);

  return {
    user,
    loading: loading || telegramLoading,
    error: error || telegramError,
    isAuthenticated: !!user,
  };
}