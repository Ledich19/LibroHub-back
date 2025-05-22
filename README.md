# Book Platform Backend

Бэкенд для платформы обмена книгами, ориентированной на украинскую аудиторию.
Поддерживает поиск книг, обмен, отзывы и локализацию (украинский/русский).
Построен на **Fastify**, **Pothos-GraphQL**, **Drizzle ORM** и **PostgreSQL**.

## Основной функционал

- **Книги**: Создание, поиск, фильтрация по жанру, автору, городу (например, «Фентезі, Київ»).
- **Обмен**: Публикация объявлений, управление статусами.
- **Отзывы**: Добавление и просмотр отзывов о книгах.
- **Пользователи**: Регистрация, профиль, базовая авторизация.
- **Локализация**: Переводы интерфейса и ошибок (украинский, русский).
- **Интеграции**: Подготовка к API Новой Пошты и Yakaboo.

## Технологический стек

- **Fastify**: Высокопроизводительный сервер для API.
- **GraphQL Yoga**: Сервер GraphQL для обработки запросов и мутаций.
- **Pothos-GraphQL**: Schema Builder для создания типобезопасных GraphQL-схем.
- **Drizzle ORM**: Управление базой данных PostgreSQL.
- **PostgreSQL**: Хранение книг, пользователей, обменов, отзывов.
- **TypeScript**: Типизация для надёжности кода.
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

## Команды
| Команда              | Зачем |
|----------------------|-------|
| `npm run check`      | Проверяет типы TypeScript без компиляции (ловит ошибки). |
| `npm run start`      | Запускает сервер в продакшене (через ts-node). |
| `npm run dev`        | Запускает сервер в разработке с авторестартом (tsx watch). |
| `npm run d:push`     | Синхронизирует схему БД без миграций (быстро, для тестов). |
| `npm run d:generate` | Генерирует SQL-миграции из `drizzle/schema.ts`. |
| `npm run d:migrate`  | Применяет миграции к БД (для продакшена). |
| `npm run test`       | Запускает Jest-тесты (если настроены). |


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
GraphQL через **Yoga** (сервер) и **Pothos** (схемы). Эндпойнт: `http://localhost:3001/graphql`.

## Интеграции
<!-- - **Новая Пошта**: Планируется API доставки (`POST https://api.novaposhta.ua/v2.0/json/`). -->


## Тестирование
- GraphQL: Playground (`http://localhost:3001/graphql`).

## Контрибьютинг
PR или [email@example.com]. Задачи:
- JWT-авторизация.
- Интеграция Новой Пошты.

## Лицензия
GNU AFFERO GENERAL PUBLIC LICENSE([LICENSE](LICENSE)).





const filters = [
  {
    name: "search",
    type: "search",
    placeholder: "Search by title or description...",
  },
  {
    name: "genres",
    type: "multi-select",
    options: [], // Запрашивать из базы (с поджанрами)
  },
  {
    name: "tags",
    type: "multi-select",
    options: [], // Запрашивать топ-10 тегов
    isSearchable: true, // Для автодополнения
  },
  {
    name: "authors",
    type: "multi-select",
    options: [], // Запрашивать из базы
    isSearchable: true, // Для частичного поиска
  },
  {
    name: "series",
    type: "multi-select",
    options: [{ label: "No series", value: null }], // Запрашивать из базы
  },
  {
    name: "language",
    type: "multi-select",
    options: [], // Запрашивать из базы
  },
  {
    name: "rating",
    type: "range",
    min: 0,
    max: 5,
    presets: ["≥3", "≥4", "≥4.5"],
  },
  {
    name: "pages",
    type: "range",
    min: 0, // Динамически из базы
    max: 1000, // Динамически из базы
    presets: ["<200", "200–500", ">500"],
  },
  {
    name: "year",
    type: "range",
    min: 1000, // Динамически из базы
    max: new Date().getFullYear(), // Динамически
    presets: ["Last 5 years", "Last 10 years"],
  },
  {
    name: "price",
    type: "range",
    min: 0, // Динамически из базы
    max: 100, // Динамически из базы
  },
  {
    name: "sort_by",
    type: "single-select",
    options: [
      { label: "Rating (High to Low)", value: "rating_desc" },
      { label: "Year (Newest First)", value: "year_desc" },
      { label: "Popularity", value: "popularity_desc" },
    ],
  },
];