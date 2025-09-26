import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Клиент для браузера
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Клиент для сервера (если нужен)
export const createServerClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey);
};

// Типы для базы данных
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          telegram_id: string;
          username: string | null;
          created_at: string;
        };
        Insert: {
          telegram_id: string;
          username?: string | null;
          created_at?: string;
        };
        Update: {
          telegram_id?: string;
          username?: string | null;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          creator_id: string;
          executor_id: string | null;
          from_location: string;
          to_location: string;
          description: string;
          price: number;
          status: 'new' | 'in_progress' | 'completed' | 'cancelled';
          delivery_date: string;
          weight_kg: number;
          image_urls: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          executor_id?: string | null;
          from_location: string;
          to_location: string;
          description: string;
          price: number;
          status?: 'new' | 'in_progress' | 'completed' | 'cancelled';
          delivery_date: string;
          weight_kg: number;
          image_urls?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          creator_id?: string;
          executor_id?: string | null;
          from_location?: string;
          to_location?: string;
          description?: string;
          price?: number;
          status?: 'new' | 'in_progress' | 'completed' | 'cancelled';
          delivery_date?: string;
          weight_kg?: number;
          image_urls?: string[];
          created_at?: string;
        };
      };
      responses: {
        Row: {
          id: string;
          order_id: string;
          deliverer_id: string;
          status: 'pending' | 'accepted' | 'rejected';
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          deliverer_id: string;
          status?: 'pending' | 'accepted' | 'rejected';
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          deliverer_id?: string;
          status?: 'pending' | 'accepted' | 'rejected';
          created_at?: string;
        };
      };
    };
  };
};

