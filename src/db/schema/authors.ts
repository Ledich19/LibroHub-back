import { pgTable, serial, varchar, timestamp, text, pgEnum } from "drizzle-orm/pg-core";

import { bookSeriesTable } from "./books_serias";
import { relations } from "drizzle-orm";

import { authorToAwardsTable } from "./author_to_awards";
import { booksToAuthorsTable } from "./books_to_authors";

export const authorStatusEnum = pgEnum("author_status", [
  "active",
  "retired",
  "deceased",
  "banned",
]);

export const genderEnum = pgEnum("gender", [
  "male",
  "female",
  "other",
])

export const authorsTable = pgTable("authors", {
  id: serial("id").primaryKey(),

  firstName: varchar("first_name", { length: 255 }).notNull(),  
  middleName: varchar("middle_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  penName: varchar("pen_name", { length: 255 }),

  bio: text("bio"),
  gender: genderEnum("gender"),
  birthDate: timestamp("birth_date"),
  deathDate: timestamp("death_date"),
  status: authorStatusEnum("status").default('active').notNull(),
  country: varchar("country", { length: 255 }),
  language: varchar("language", { length: 255 }),

  photoUrl: varchar("photo_url", { length: 255 }),
  website: varchar("website", { length: 255 }),
  twitter: varchar("twitter", { length: 255 }),
  facebook: varchar("facebook", { length: 255 }),
  instagram: varchar("instagram", { length: 255 }),
  linkedin: varchar("linkedin", { length: 255 }),
  email: varchar("email", { length: 320 }),
  
  slug: varchar("slug", { length: 255 }).unique().notNull(), 
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()).notNull(),
});

export const authorsTableRelations = relations(authorsTable, ({ one, many }) => ({
  books: many(booksToAuthorsTable),
  bookSeries: many(bookSeriesTable),
  awards: many(authorToAwardsTable),
}));
