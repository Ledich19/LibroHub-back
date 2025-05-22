import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { booksToGenresTable } from "./book_to_genres";

export const genresTable = pgTable("genres", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).unique().notNull(),
});

export const genresTableRelations = relations(genresTable, ({ many }) => ({
  books: many(booksToGenresTable),
}));