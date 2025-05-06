import {
  pgTable,
  serial,
  varchar,
  integer,
  real,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { books } from "./books";
import { bookSeriesRatings } from "./book_series_ratings";

export const bookSeries = pgTable("book_series", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  rating: real("rating").default(0).notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()).notNull(),
});

export const bookSeriesRelations = relations(bookSeries, ({ many }) => ({
  books: many(books),
  ratings: many(bookSeriesRatings),
}));
