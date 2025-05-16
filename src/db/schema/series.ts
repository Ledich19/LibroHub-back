import {
  pgTable,
  serial,
  varchar,
  real,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { seriesRatingsTable } from "./series_ratings";
import { booksTable } from "./books";
import { seriesToAuthorsTable } from "./series_to_authors";

export const seriesTable = pgTable("series", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(), // URL-friendly unique identifier
  description: varchar("description", { length: 1024 }),
  coverUrl: varchar("cover_url", { length: 255 }),
  rating: real("rating").default(0).notNull(), // User-submitted rating for the whole series
  averageRating: real("average_rating").default(0).notNull(), // Average rating of all books in the series
  isPublished: boolean("is_published").default(true).notNull(), // Whether the series is visible to users
  isVerified: boolean("is_verified").default(false).notNull(), // Whether the series is approved by moderation
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});

export const seriesRelations = relations(seriesTable, ({ many }) => ({
  books: many(booksTable),
  ratings: many(seriesRatingsTable),
  authors: many(seriesToAuthorsTable),
}));
