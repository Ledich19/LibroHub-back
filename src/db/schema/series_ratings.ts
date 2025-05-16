import { pgTable, serial, integer, unique, check } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { usersTable } from "./users";
import { seriesTable } from "./series";

export const seriesRatingsTable = pgTable("series_ratings", {
  id: serial("id").primaryKey(),
  value: integer("value").notNull(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  seriesId: integer("series_id").notNull().references(() => seriesTable.id),
}, (table) => [
  unique("unique_user_series").on(table.userId, table.seriesId),
  check("rating_check1", sql`${table.value} >= 0 AND ${table.value} <= 10`),
]);

export const seriesRatingsTableRelations = relations(seriesRatingsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [seriesRatingsTable.userId],
    references: [usersTable.id],
  }),
  series: one(seriesTable, {
    fields: [seriesRatingsTable.seriesId],
    references: [seriesTable.id],
  }),
}));
