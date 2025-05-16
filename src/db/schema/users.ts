import {
  pgTable,
  serial,
  varchar,
  timestamp,
  boolean,
  integer,
  json,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { seriesRatingsTable } from "./series_ratings";
import { bookReviewsTable } from "./book_reviews";
import { userToAchievementsTable } from "./user_to_achievements_table";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),

  email: varchar("email", { length: 255 }).unique().notNull(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  username: varchar("username", { length: 50 }).unique(),
  name: varchar("name", { length: 255 }),

  preferences: json("preferences"),
  isAdmin: boolean("is_admin").default(false).notNull(), // Флаг — является ли пользователь администратором

  avatarUrl: varchar("avatar_url", { length: 512 }), // URL к аватару пользователя
  bio: varchar("bio", { length: 1024 }), // описание пользователя

  totalPoints: integer("total_points").default(0).notNull(), // Сумма очков пользователя (например, за достижения)
  totalReviews: integer("total_reviews").default(0).notNull(), // Количество написанных отзывов 
  totalBooksRead: integer("total_books_read").default(0).notNull(), // Количество прочитанных книг

  lastLoginAt: timestamp("last_login_at"), // Дата последнего входа (можно использовать для аналитики/блокировок)
  createdAt: timestamp("created_at").defaultNow().notNull(), // Дата создания аккаунта
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
  deletedAt: timestamp("deleted_at"), // если не null — пользователь считается удалённым
});

export const usersRelations = relations(usersTable, ({ many }) => ({
  reviews: many(bookReviewsTable), // Связь с отзывами книг
  seriesRatings: many(seriesRatingsTable), // Связь с рейтингами книжных серий
  achievements: many(userToAchievementsTable), // Связь с полученными достижениями
}));
