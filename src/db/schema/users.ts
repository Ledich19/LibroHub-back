import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { bookRatings } from "./book_ratings";
import { bookSeriesRatings } from "./book_series_ratings";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()).notNull(),
});

export const usersRelations = relations(usersTable, ({ many }) => ({
  ratings: many(bookRatings),
  bookSeriesRatings: many(bookSeriesRatings),
}));