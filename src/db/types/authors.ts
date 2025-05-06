import { authors } from "../schema/authors";

export type Author = typeof authors.$inferSelect;
export type NewAuthor = typeof authors.$inferInsert;
