import { pgTable, serial, varchar, integer, real, text, date } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { bookSeries } from "./book_series";
import { bookRatings } from "./book_ratings";
import { bookAuthors } from "./book_authors";
import { bookGenres } from "./genres";
import { languages } from "./languages";

export const books = pgTable("books", {
  id: serial("id").primaryKey(),

  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  rating: real("rating").default(0).notNull(),
  languageCode: varchar("language_code", { length: 5 }).references(() => languages.code),
  publishedDate: date("published_date"),
  publisher: varchar("publisher", { length: 255 }),
  pageCount: integer("page_count"),
  seriesIndex: integer("series_index").default(0),
  bookSeriesId: integer("book_series_id").references(() => bookSeries.id),
  //ISBN (International Standard Book Number) — международный стандартный номер книги
  isbn: varchar("isbn", { length: 20 }),
  
  slug: varchar("slug", { length: 255 }).unique().notNull(), 

  coverUrl: varchar("cover_url", { length: 255 }),
  previewUrl: varchar("preview_url", { length: 255 }),
  downloadUrl: varchar("download_url", { length: 255 }),

});

export const booksRelations = relations(books, ({ one, many }) => ({
  bookSeries: one(bookSeries, {
    fields: [books.bookSeriesId],
    references: [bookSeries.id],
  }),
  language: one(languages, {
    fields: [books.languageCode],
    references: [languages.code],
  }),
  genres: many(bookGenres),
  ratings: many(bookRatings),
  authors: many(bookAuthors),
}));
