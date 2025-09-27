import { useState, useEffect } from 'react';
import { User } from '@/types';
import { getTelegramUserData } from '@/lib/telegram';
import { api } from '@/lib/api';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initUser = async () => {
      try {
        setLoading(true);
        setError(null);

        // Получаем данные пользователя из Telegram
        const telegramUserData = getTelegramUserData();
        
        if (!telegramUserData) {
          setError('Не удалось получить данные пользователя из Telegram');
          setLoading(false);
          return;
        }

        // Синхронизируем пользователя с сервером
        const response = await api.post<User>('/users/sync', {
          telegram_id: telegramUserData.telegram_id,
          username: telegramUserData.username,
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

    initUser();
  }, []);

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      const response = await api.patch<User>(`/users/${user.telegram_id}`, updates);
      
      if (response.success && response.data) {
        setUser(response.data);
        return true;
      } else {
        setError(response.error || 'Ошибка обновления пользователя');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      return false;
    }
  };

  return {
    user,
    loading,
    error,
    updateUser,
    isAuthenticated: !!user,
  };
}


