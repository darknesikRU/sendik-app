'use client';

import { useEffect, useState } from 'react';
import { TelegramUser } from '@/types';

export function useTelegramUser() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    const initTelegramUser = () => {
      try {
        const tg = window.Telegram?.WebApp;

        if (!tg) {
          throw new Error('Telegram WebApp is not available');
        }

        tg.ready();
        tg.expand();

        const unsafeData = tg.initDataUnsafe;
        const tgUser = unsafeData?.user;

        if (tgUser) {
          setUser(tgUser);
        } else {
          throw new Error('Telegram user data is not available');
        }
      } catch (err) {
        console.error('Telegram init error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    if (window.Telegram?.WebApp) {
      initTelegramUser();
    } else {
      const timer = setTimeout(() => {
        initTelegramUser();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  return {
    user,
    isLoading,
    error,
    webApp: typeof window !== 'undefined' ? window.Telegram?.WebApp : undefined,
  };
}
