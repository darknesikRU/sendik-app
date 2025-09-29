// Базовые типы для Sendik

export type { TelegramUser } from './telegram';

export interface Order {
  id: string;
  creator_id: string;
  executor_id: string | null;
  from_location: string;
  to_location: string;
  description: string;
  price: number | string; // Prisma Decimal может быть строкой
  status: OrderStatus;
  delivery_date: string;
  weight_kg: number | string; // Prisma Decimal может быть строкой
  image_urls: string[];
  created_at: string;
}

export type OrderStatus = 'new' | 'in_progress' | 'completed' | 'cancelled';

export interface Response {
  id: string;
  order_id: string;
  deliverer_id: string;
  status: ResponseStatus;
  created_at: string;
}

export type ResponseStatus = 'pending' | 'accepted' | 'rejected';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
// Модель пользователя системы
export type User = {
  username: string;
  id: string;
  telegramId: string;
  name?: string;
  avatarUrl?: string;
  rating: number;
};

