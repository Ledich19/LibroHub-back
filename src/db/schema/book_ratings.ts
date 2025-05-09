import { integer, pgTable, serial, unique } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { usersTable } from "./users";
import { books } from "./books";

export const bookRatings = pgTable("book_ratings", {
  id: serial("id").primaryKey(),
  value: integer("value").notNull(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  bookId: integer("book_id").notNull().references(() => books.id),
}, (table) => [
  unique("user_book_unique").on(table.userId, table.bookId),
  sql`CONSTRAINT value_check CHECK (value >= 0 AND value <= 10)`
]);

// relations (опционально)
export const bookRatingsRelations = relations(bookRatings, ({ one }) => ({
  user: one(usersTable, {
    fields: [bookRatings.userId],
    references: [usersTable.id],
  }),
  book: one(books, {
    fields: [bookRatings.bookId],
    references: [books.id],
  }),
}));


