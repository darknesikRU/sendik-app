# 🚀 Быстрый старт Sendik

## 1. Настройка базы данных

### Вариант A: Supabase (рекомендуется)
1. Создайте проект на [supabase.com](https://supabase.com)
2. Скопируйте Connection String из Settings > Database
3. Создайте файл `.env`:
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
```

### Вариант B: Локальная PostgreSQL
```env
DATABASE_URL="postgresql://username:password@localhost:5432/sendik"
```

## 2. Запуск миграций

```bash
# Генерация Prisma клиента
npx prisma generate

# Создание миграции
npx prisma migrate dev --name init
```

## 3. Запуск проекта

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

## 🎯 Готово!

Проект готов к использованию. Все API endpoints работают с Prisma.

### Полезные команды:
```bash
# Просмотр базы данных
npx prisma studio

# Новая миграция
npx prisma migrate dev --name migration_name

# Сброс базы данных
npx prisma migrate reset
```

**Удачной разработки! 🚀**

