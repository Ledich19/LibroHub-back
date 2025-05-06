import { pgTable, integer } from "drizzle-orm/pg-core";
import { authors } from "./authors";
import { awards } from "./awards";
import { relations } from "drizzle-orm";

export const authorAwards = pgTable("author_awards", {
  authorId: integer("author_id").references(() => authors.id).notNull(),
  awardId: integer("award_id").references(() => awards.id).notNull(),
});

export const authorAwardsRelations = relations(authorAwards, ({ one }) => ({
  author: one(authors, {
    fields: [authorAwards.authorId],
    references: [authors.id],
  }),
  award: one(awards, {
    fields: [authorAwards.awardId],
    references: [awards.id],
  }),
}));