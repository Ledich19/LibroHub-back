import { pgTable, serial, integer, unique, check } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { usersTable } from "./users";
import { bookSeries } from "./book_series";

export const bookSeriesRatings = pgTable("book_series_ratings", {
  id: serial("id").primaryKey(),
  value: integer("value").notNull(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  bookSeriesId: integer("book_series_id").notNull().references(() => bookSeries.id),
}, (table) => [
  unique("unique_user_series").on(table.userId, table.bookSeriesId),
  check("rating_check1", sql`${table.value} >= 0 AND ${table.value} <= 10`),
]);

export const bookSeriesRatingsRelations = relations(bookSeriesRatings, ({ one }) => ({
  user: one(usersTable, {
    fields: [bookSeriesRatings.userId],
    references: [usersTable.id],
  }),
  bookSeries: one(bookSeries, {
    fields: [bookSeriesRatings.bookSeriesId],
    references: [bookSeries.id],
  }),
}));
