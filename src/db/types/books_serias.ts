import { seriesTable } from "../schema"


export type DbSeries = typeof  seriesTable.$inferSelect
export type DbNewSeries = typeof seriesTable.$inferInsert