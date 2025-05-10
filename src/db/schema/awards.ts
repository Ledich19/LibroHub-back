import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";
import { authorToAwardsTable } from "./author_to_awards";

export const awards = pgTable("awards", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  year: integer("year").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});

export const awardsRelations = relations(awards, ({ one, many }) => ({
  authors: many(authorToAwardsTable),
}));
