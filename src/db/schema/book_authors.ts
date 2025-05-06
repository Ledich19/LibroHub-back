import { pgTable, integer, primaryKey } from "drizzle-orm/pg-core";
import { books } from "./books";
import { authors } from "./authors";
import { relations } from "drizzle-orm";

export const bookAuthors = pgTable("book_authors", {
  bookId: integer("book_id").references(() => books.id).notNull(),
  authorId: integer("author_id").references(() => authors.id).notNull(),
}, (t) => [primaryKey({ columns: [t.bookId, t.authorId] })]);

export const bookAuthorsRelations = relations(bookAuthors, ({ one }) => ({
  book: one(books, {
    fields: [bookAuthors.bookId],
    references: [books.id],
  }),
  author: one(authors, {
    fields: [bookAuthors.authorId],
    references: [authors.id],
  }),
}));