# 🗄️ Настройка Prisma для Sendik

## 📋 Что нужно сделать

### 1. Настройка базы данных

Выберите один из вариантов:

#### Вариант A: Локальная PostgreSQL
```bash
# Установите PostgreSQL локально
# Создайте базу данных
createdb sendik

# Обновите .env файл
DATABASE_URL="postgresql://username:password@localhost:5432/sendik?schema=public"
```

#### Вариант B: Supabase (рекомендуется)
1. Создайте проект в [Supabase](https://supabase.com)
2. Скопируйте Connection String из Settings > Database
3. Обновите .env файл:
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

#### Вариант C: Railway/Neon (облачные решения)
- [Railway](https://railway.app) - простой деплой
- [Neon](https://neon.tech) - serverless PostgreSQL

### 2. Настройка переменных окружения

Создайте файл `.env` в корне проекта:
```env
DATABASE_URL="your_database_url_here"
```

### 3. Запуск миграций

```bash
# Генерация Prisma клиента
npx prisma generate

# Создание и применение миграции
npx prisma migrate dev --name init

# Просмотр базы данных (опционально)
npx prisma studio
```

### 4. Запуск проекта

```bash
npm run dev
```

## 🔧 Полезные команды Prisma

```bash
# Создание новой миграции
npx prisma migrate dev --name migration_name

# Сброс базы данных
npx prisma migrate reset

# Просмотр базы данных в браузере
npx prisma studio

# Генерация только клиента
npx prisma generate

# Применение миграций в продакшене
npx prisma migrate deploy
```

## 📊 Структура базы данных

### Таблицы:
- **users** - пользователи (telegram_id, username)
- **orders** - заказы на доставку
- **responses** - отклики на заказы

### Связи:
- User 1:N Order (creator)
- User 1:N Order (executor)
- User 1:N Response
- Order 1:N Response

## 🚀 Деплой с Prisma

### Vercel
1. Добавьте переменную `DATABASE_URL` в настройки Vercel
2. В настройках сборки добавьте:
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

### Другие платформы
- **Railway**: автоматически подхватывает Prisma
- **Netlify**: требует настройки build command
- **DigitalOcean**: используйте App Platform

## 🔍 Отладка

### Проблемы с подключением
```bash
# Проверка подключения
npx prisma db pull

# Синхронизация схемы
npx prisma db push
```

### Просмотр данных
```bash
# Открыть Prisma Studio
npx prisma studio
```

## ✅ Готово!

После выполнения всех шагов:
1. База данных будет создана
2. Таблицы будут созданы автоматически
3. API будет работать с Prisma
4. Проект готов к использованию!

**Удачной разработки! 🚀**


