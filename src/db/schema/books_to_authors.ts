import { pgTable, integer, primaryKey } from "drizzle-orm/pg-core";
import { authorsTable } from "./authors";
import { relations } from "drizzle-orm";
import { booksTable } from "./books";

export const booksToAuthorsTable = pgTable("books_to_authors", {
  bookId: integer("book_id").references(() => booksTable.id).notNull(),
  authorId: integer("author_id").references(() => authorsTable.id).notNull(),
}, (t) => [primaryKey({ columns: [t.bookId, t.authorId] })]);

export const booksToAuthorsTableRelations = relations(booksToAuthorsTable, ({ one }) => ({
  book: one(booksTable, {
    fields: [booksToAuthorsTable.bookId],
    references: [booksTable.id],
  }),
  author: one(authorsTable, {
    fields: [booksToAuthorsTable.authorId],
    references: [authorsTable.id],
  }),
}));