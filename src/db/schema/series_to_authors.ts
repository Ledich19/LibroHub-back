import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { seriesTable } from "./series";
import { authorsTable } from "./authors";
import { relations } from "drizzle-orm";

export const seriesToAuthorsTable = pgTable(
  "series_to_authors",
  {
    seriesId: integer("series_id")
      .references(() => seriesTable.id)
      .notNull(),
    authorId: integer("author_id")
      .references(() => authorsTable.id)
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.seriesId, table.authorId] })]
);

export const seriesToAuthorsTableRelations = relations(
  seriesToAuthorsTable,
  ({ one }) => ({
    series: one(seriesTable, {
      fields: [seriesToAuthorsTable.seriesId],
      references: [seriesTable.id],
    }),
    author: one(authorsTable, {
      fields: [seriesToAuthorsTable.authorId],
      references: [authorsTable.id],
    }),
  })
);