import { languagesTable } from "../schema"


export type DbLanguage = typeof languagesTable.$inferSelect
export type DbNewLanguage = typeof languagesTable.$inferInsert