import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { booksTable } from "./books";

export const genres = pgTable("genres", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).unique().notNull(),
});

export const bookGenres = pgTable("book_genres", {
  bookId: integer("book_id").references(() => booksTable.id).notNull(),
  genreId: integer("genre_id").references(() => genres.id).notNull(),
});