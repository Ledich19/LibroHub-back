import { pgTable, integer, primaryKey } from "drizzle-orm/pg-core";
import { authors } from "./authors";
import { relations } from "drizzle-orm";
import { booksTable } from "./books";

export const bookAuthors = pgTable("book_authors", {
  bookId: integer("book_id").references(() => booksTable.id).notNull(),
  authorId: integer("author_id").references(() => authors.id).notNull(),
}, (t) => [primaryKey({ columns: [t.bookId, t.authorId] })]);

export const bookAuthorsRelations = relations(bookAuthors, ({ one }) => ({
  book: one(booksTable, {
    fields: [bookAuthors.bookId],
    references: [booksTable.id],
  }),
  author: one(authors, {
    fields: [bookAuthors.authorId],
    references: [authors.id],
  }),
}));