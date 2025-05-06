import { integer, pgTable, serial, unique } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { users } from "./users";
import { books } from "./books";

export const bookRatings = pgTable("book_ratings", {
  id: serial("id").primaryKey(),
  value: integer("value").notNull(),
  userId: integer("user_id").notNull().references(() => users.id),
  bookId: integer("book_id").notNull().references(() => books.id),
}, (table) => [
  unique("user_book_unique").on(table.userId, table.bookId),
  sql`CONSTRAINT value_check CHECK (value >= 0 AND value <= 10)`
]);

// relations (опционально)
export const bookRatingsRelations = relations(bookRatings, ({ one }) => ({
  user: one(users, {
    fields: [bookRatings.userId],
    references: [users.id],
  }),
  book: one(books, {
    fields: [bookRatings.bookId],
    references: [books.id],
  }),
}));


