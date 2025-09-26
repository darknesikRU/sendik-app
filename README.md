# Sendik - P2P доставка посылок

Telegram WebApp для доставки посылок попутчиками. Пользователи могут создавать заказы на доставку и откликаться на заказы других пользователей.

## 🚀 Технологии

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes + Supabase
- **База данных**: Supabase (PostgreSQL)
- **Auth**: Telegram WebApp (через initData)

## 📋 Функциональность

- ✅ Регистрация пользователей через Telegram
- ✅ Создание заказов на доставку
- ✅ Витрина заказов с фильтрами
- ✅ Система откликов на заказы
- ✅ Управление заказами (созданные/выполняемые)
- ✅ Адаптивный дизайн для мобильных устройств

## 🛠️ Установка и настройка

### 1. Клонирование и установка зависимостей

```bash
cd sendik-app
npm install
```

### 2. Настройка Supabase

1. Создайте проект в [Supabase](https://supabase.com)
2. Скопируйте `env.example` в `.env.local`
3. Заполните переменные окружения:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

3. Выполните SQL скрипт `supabase-schema.sql` в Supabase SQL Editor

### 3. Запуск проекта

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## 📱 Интеграция с Telegram

Для полноценной работы приложения необходимо:

1. Создать Telegram бота через [@BotFather](https://t.me/BotFather)
2. Настроить WebApp URL в настройках бота
3. Добавить бота в Telegram и открыть WebApp

## 🗄️ Структура базы данных

### Таблицы:
- `users` - пользователи (telegram_id, username)
- `orders` - заказы на доставку
- `responses` - отклики на заказы

### Связи:
- Пользователь может создавать заказы (1:many)
- Пользователь может откликаться на заказы (many:many через responses)
- Заказ может иметь исполнителя (1:1)

## 🎨 Компоненты

- `Header` - шапка с информацией о пользователе
- `Footer` - навигация по приложению
- `OrderCard` - карточка заказа
- `OrderFilters` - фильтры для поиска заказов

## 📄 API Endpoints

- `POST /api/users/sync` - синхронизация пользователя
- `GET /api/orders` - получение списка заказов
- `POST /api/orders` - создание заказа
- `GET /api/orders/[id]` - получение заказа
- `PATCH /api/orders/[id]` - обновление заказа
- `POST /api/orders/[id]/responses` - отклик на заказ
- `GET /api/my-orders` - мои заказы

## 🔧 Разработка

### Структура проекта:
```
src/
├── app/                 # Страницы App Router
├── components/          # React компоненты
├── hooks/              # Кастомные хуки
├── lib/                # Утилиты и конфиги
└── types/              # TypeScript типы
```

### Основные хуки:
- `useUser` - работа с пользователем
- `useOrders` - управление заказами
- `useResponses` - управление откликами

## 🚀 Деплой

1. Подключите проект к Vercel
2. Настройте переменные окружения
3. Выполните миграции базы данных
4. Настройте Telegram WebApp URL

## 📝 TODO

- [ ] Добавить уведомления
- [ ] Реализовать чат между пользователями
- [ ] Добавить рейтинговую систему
- [ ] Интеграция с платежными системами
- [ ] Push-уведомления через Telegram Bot API