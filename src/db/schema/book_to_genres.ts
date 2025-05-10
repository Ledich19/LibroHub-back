import { pgTable, integer } from "drizzle-orm/pg-core";
import { booksTable } from "./books";
import { genresTable } from "./genres";
import { relations } from "drizzle-orm";

export const booksToGenresTable = pgTable("book_to_genres", {
  bookId: integer("book_id").references(() => booksTable.id).notNull(),
  genreId: integer("genre_id").references(() => genresTable.id).notNull(),
});

export const bookGenresRelations = relations(booksToGenresTable, ({ one }) => ({
  book: one(booksTable, {
    fields: [booksToGenresTable.bookId],
    references: [booksTable.id],
  }),
  genre: one(genresTable, {
    fields: [booksToGenresTable.genreId],
    references: [genresTable.id],
  }),
}));