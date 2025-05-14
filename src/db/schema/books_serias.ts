import {
  pgTable,
  serial,
  varchar,
  real,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { bookSeriesRatingsTable } from "./book_series_ratings";
import { booksTable } from "./books";

export const booksSeriesTable = pgTable("book_series", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  rating: real("rating").default(0).notNull(), // Средний рейтинг выставленый пользователями
  averageRating: real("average_rating").default(0).notNull(), // Средний рейтинг всех книг в серии
  
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()).notNull(),
});

export const bookSeriesRelations = relations(booksSeriesTable, ({ many }) => ({
  books: many(booksTable),
  ratings: many(bookSeriesRatingsTable),
}));
