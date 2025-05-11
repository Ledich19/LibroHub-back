import { authorsTable } from "../schema"

export type DbAuthor = typeof authorsTable.$inferSelect
export type DbNewAuthor = typeof authorsTable.$inferInsert