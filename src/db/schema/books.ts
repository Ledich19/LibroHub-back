import { pgTable, serial, varchar, integer, real, text, date,  doublePrecision } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { bookSeriesTable } from "./books_serias";


import { languagesTable } from "./languages";
import { bookReviewsTable } from "./book_reviews";
import { bookGenres } from "./genres";
import { booksToAuthorsTable } from "./books_to_authors";

export const booksTable = pgTable("books", {
  id: serial("id").primaryKey(),

  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  rating: real("rating").default(0).notNull(),
  languageCode: varchar("language_code", { length: 5 }).references(() => languagesTable.code),
  
  publishedDate: date("published_date"),

  publisher: varchar("publisher", { length: 255 }),
  pageCount: integer("page_count"),
  seriesIndex: integer("series_index").default(0),
  bookSeriesId: integer("book_series_id").references(() => bookSeriesTable.id),

  totalReviews: integer("total_reviews").default(0),
  averageRating: doublePrecision("average_rating").default(0),
  //ISBN (International Standard Book Number) — международный стандартный номер книги
  isbn: varchar("isbn", { length: 20 }),
  
  slug: varchar("slug", { length: 255 }).unique().notNull(), 

  coverUrl: varchar("cover_url", { length: 255 }),
  previewUrl: varchar("preview_url", { length: 255 }),
  downloadUrl: varchar("download_url", { length: 255 }),
  

});

export const booksRelations = relations(booksTable, ({ one, many }) => ({
  bookSeries: one(bookSeriesTable, {
    fields: [booksTable.bookSeriesId],
    references: [bookSeriesTable.id],
  }),
  language: one(languagesTable, {
    fields: [booksTable.languageCode],
    references: [languagesTable.code],
  }),

  genres: many(bookGenres),
  reviews: many(bookReviewsTable),
  authors: many(booksToAuthorsTable),
}));
