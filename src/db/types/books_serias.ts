import { booksSeriesTable } from "../schema"


export type DbBookSeries = typeof  booksSeriesTable.$inferSelect
export type DbNewBookSeries = typeof booksSeriesTable.$inferInsert