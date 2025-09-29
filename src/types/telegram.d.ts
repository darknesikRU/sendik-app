// types/telegram.d.ts

// Правильный тип для Telegram пользователя согласно API
export type TelegramUser = {
    id: number;  // В Telegram API id всегда number
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    language_code?: string;
    is_bot?: boolean;
    is_premium?: boolean;
    added_to_attachment_menu?: boolean;
    allows_write_to_pm?: boolean;
  };

  declare global {
    interface Window {
      Telegram: {
        WebApp: {
          initDataUnsafe: {
            user?: TelegramUser;
            query_id?: string;
            auth_date?: string;
            hash?: string;
          };
          ready: () => void;
          expand: () => void;
          close: () => void;
          colorScheme: 'light' | 'dark';
          themeParams: {
            bg_color?: string;
            text_color?: string;
            hint_color?: string;
            link_color?: string;
            button_color?: string;
            button_text_color?: string;
          };
          platform: 'tdesktop' | 'android' | 'ios' | 'web';
          sendData: (data: string) => void;
          onEvent: (eventType: string, handler: () => void) => void;
          offEvent: (eventType: string, handler: () => void) => void;
        };
      };
    }
  }
  
  export {};