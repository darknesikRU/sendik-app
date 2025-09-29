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

    const checkTelegramWebApp = () => {
      return new Promise<void>((resolve, reject) => {
        const maxAttempts = 50;
        let attempts = 0;

        const intervalId = setInterval(() => {
          attempts++;
          if (window.Telegram?.WebApp) {
            clearInterval(intervalId);
            resolve();
          } else if (attempts >= maxAttempts) {
            clearInterval(intervalId);
            reject(new Error('Telegram WebApp не загрузился'));
          }
        }, 100);
      });
    };

    const initTelegramUser = async () => {
      try {
        await checkTelegramWebApp();

        const tg = window.Telegram.WebApp;
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

    initTelegramUser();

    return () => {};
  }, []);

  return {
    user,
    isLoading,
    error,
    webApp: typeof window !== 'undefined' ? window.Telegram?.WebApp : undefined,
  };
}