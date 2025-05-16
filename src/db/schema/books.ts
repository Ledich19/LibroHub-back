import {
  pgTable,
  serial,
  varchar,
  integer,
  text,
  date,
  doublePrecision,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { seriesTable } from "./series";
import { languagesTable } from "./languages";
import { bookReviewsTable } from "./book_reviews";
import { bookGenres } from "./genres";
import { booksToAuthorsTable } from "./books_to_authors";
import { usersTable } from "./users";

// Main "books" table definition
export const booksTable = pgTable("books", {
  id: serial("id").primaryKey(),

  title: varchar("title", { length: 255 }).notNull(),                    // Title of the book
  originalTitle: varchar("original_title", { length: 255 }),            // Original title (for translated books)
  description: text("description"),                                     // Full description

  slug: varchar("slug", { length: 255 }).unique().notNull(),            // SEO-friendly unique identifier
  isbn: varchar("isbn", { length: 20 }),                                // International Standard Book Number

  languageCode: varchar("language_code", { length: 5 })                 // Language code (e.g. "en", "ru")
    .references(() => languagesTable.code),

  ageLimit: integer("age_limit"),                                       // Age restriction if any
  pageCount: integer("page_count"),                                     // Number of pages
  publisher: varchar("publisher", { length: 255 }),                     // Publisher name
  publishedDate: date("published_date"),                                // Original publication date

  // === Series & Grouping ===
  seriesIndex: integer("series_index").default(0),                      // Order in book series
  seriesId: integer("series_id")                               // FK to series
    .references(() => seriesTable.id),

  // === Ratings & Reviews ===
  rating: doublePrecision("rating").default(0).notNull(),               // Average rating (0–5)
  totalReviews: integer("total_reviews").default(0),                    // Cached total review count

  // === Media & External Links ===
  coverUrl: varchar("cover_url", { length: 255 }),                      // Cover image
  previewUrl: varchar("preview_url", { length: 255 }),                  // Preview (first chapter, etc.)
  downloadUrl: varchar("download_url", { length: 255 }),                // Download link (if allowed)

  // === Moderation & Publication State ===
  isPublished: boolean("is_published").default(true).notNull(),         // Soft-publish flag (visible to public)
  isVerified: boolean("is_verified").default(false).notNull(),          // Moderation flag (verified by admin)

  // === Ownership & Audit Metadata ===
  createdAt: timestamp("created_at").defaultNow().notNull(),            // Insert timestamp
  updatedAt: timestamp("updated_at").defaultNow().notNull(),            // Last update timestamp
  createdByUserId: integer("created_by_user_id")                        // FK to user who created the book
    .references(() => usersTable.id),
});

// === Relations for the books table ===
export const booksRelations = relations(booksTable, ({ one, many }) => ({
  series: one(seriesTable, {
    fields: [booksTable.seriesId],
    references: [seriesTable.id],
  }),
  language: one(languagesTable, {
    fields: [booksTable.languageCode],
    references: [languagesTable.code],
  }),
  genres: many(bookGenres),
  reviews: many(bookReviewsTable),
  authors: many(booksToAuthorsTable),
}));

// === Tags System (for future implementation) ===
// Normalized keyword tagging system for scalable filtering
// export const tagsTable = pgTable("tags", {
//   id: serial("id").primaryKey(),
//   name: varchar("name", { length: 64 }).unique().notNull(),             // Unique lowercase keyword
// });

// export const bookTagsTable = pgTable("book_tags", {
//   bookId: integer("book_id").references(() => booksTable.id).notNull(),
//   tagId: integer("tag_id").references(() => tagsTable.id).notNull(),
// });
