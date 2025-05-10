import { pgTable, integer } from "drizzle-orm/pg-core";
import { authorsTable } from "./authors";
import { awards } from "./awards";
import { relations } from "drizzle-orm";

export const authorToAwardsTable = pgTable("author_awards", {
  authorId: integer("author_id").references(() => authorsTable.id).notNull(),
  awardId: integer("award_id").references(() => awards.id).notNull(),
});

export const authorAwardsRelations = relations(authorToAwardsTable , ({ one }) => ({
  author: one(authorsTable, {
    fields: [authorToAwardsTable .authorId],
    references: [authorsTable.id],
  }),
  award: one(awards, {
    fields: [authorToAwardsTable .awardId],
    references: [awards.id],
  }),
}));