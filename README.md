# Book Platform Backend

Бекенд для платформи обміну книгами, орієнтованої на українську аудиторію.  
Підтримує пошук книг, обмін, відгуки та локалізацію (українська/російська).  
Побудований на **Fastify**, **Pothos-GraphQL**, **Drizzle ORM** і **PostgreSQL**.

## Основной функционал

- **Книги**: Створення, пошук, фільтрація за жанром, автором, містом (наприклад, «Фентезі, Київ»).
<!-- - **Обмін**: Публікація оголошень, керування статусами.
- **Відгуки**: Додавання та перегляд відгуків про книги.
- **Користувачі**: Реєстрація, профіль, базова авторизація.
- **Локалізація**: Переклади інтерфейсу та помилок (українська, російська).
- **Інтеграції**: Підготовка до API Нової Пошти та Yakaboo. -->

## Технологический стек

- **Fastify**: Високопродуктивний сервер для API.
- **GraphQL Yoga**: GraphQL-сервер для обробки запитів та мутацій.
- **Pothos-GraphQL**: Schema Builder для створення типобезпечних GraphQL-схем.
- **Drizzle ORM**: Керування базою даних PostgreSQL.
- **PostgreSQL**: Зберігання книг, користувачів, обмінів, відгуків.
- **TypeScript**: Типізація для надійності коду.
- **Node.js**: >= 18.

### Требования

- Node.js >= 18
- PostgreSQL >= 15
- Yarn или npm

### Шаги
1. Клонировать:
   ```bash
   git clone https://github.com/your-username/book-platform-server.git
   cd book-platform-server
   ```
2. Установить зависимости:
   ```bash
   npm install
   ```
3. Настроить `.env`:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/book_platform
   PORT=3001
   ```
4. Миграции:
   ```bash
   npm run d:generate
   npm run d:migrate
   ```
   Или быстрый пуш:
   ```bash
   npm run d:push
   ```
5. Запуск:
   ```bash
   npm run dev
   ```
   Продакшен:
   ```bash
   npm run start
   ```
6. GraphQL Playground: `http://localhost:3001/graphql`.

## Команди
| Команда              | Опис |
|----------------------|------|
| `npm run check`      | Перевіряє типи TypeScript без компіляції (виявляє помилки). |
| `npm run start`      | Запускає сервер у продакшн-режимі (через ts-node). |
| `npm run dev`        | Запускає сервер у режимі розробки з автоперезапуском (tsx watch). |
| `npm run d:push`     | Синхронізує схему БД без міграцій (швидко, для тестів). |
| `npm run d:generate` | Генерує SQL-міграції з `drizzle/schema.ts`. |
| `npm run d:migrate`  | Застосовує міграції до БД (для продакшну). |
| `npm run test`       | Запускає Jest-тести (якщо налаштовані). |


## Структура
```
book-platform-server/
├── drizzle/
├── src/
│   ├── db/ 
│   │   ├── schema/
│   │   ├── seeds/
│   │   ├── types/
│   │   ├── index.ts
│   ├── graphql/
│   │   ├── schema/
│   │   ├── builder.ts
│   │   ├── context.ts
│   ├── middleware/
│   ├── app.ts       
│   ├── index.ts
├── .env
├── package.json
├── drizzle.config.ts
├── tsconfig.json
```

## API
GraphQL через **Yoga** (сервер) и **Pothos** (схемы). Эндпойнт: `http://localhost:4000/graphql`.
## Інтеграції  
<!-- - **Нова Пошта**: Планується API доставки (`POST https://api.novaposhta.ua/v2.0/json/`). -->

## Тестування  
- GraphQL: Playground (`http://localhost:4000/graphql`).

## Контриб'юти  
PR або [email@example.com]. Завдання:  


## Лицензия
GNU AFFERO GENERAL PUBLIC LICENSE([LICENSE](LICENSE)).
