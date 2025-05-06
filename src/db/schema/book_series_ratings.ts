import { pgTable, serial, integer, unique } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { users } from "./users";
import { bookSeries } from "./book_series";

export const bookSeriesRatings = pgTable("book_series_ratings", {
  id: serial("id").primaryKey(),
  value: integer("value").notNull(),
  userId: integer("user_id").notNull().references(() => users.id),
  bookSeriesId: integer("book_series_id").notNull().references(() => bookSeries.id),
}, (table) => [
  unique("unique_user_series").on(table.userId, table.bookSeriesId),
  sql`CONSTRAINT value_check CHECK (value >= 0 AND value <= 10)`
]);

export const bookSeriesRatingsRelations = relations(bookSeriesRatings, ({ one }) => ({
  user: one(users, {
    fields: [bookSeriesRatings.userId],
    references: [users.id],
  }),
  bookSeries: one(bookSeries, {
    fields: [bookSeriesRatings.bookSeriesId],
    references: [bookSeries.id],
  }),
}));
