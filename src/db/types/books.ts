import { booksTable } from "../schema";


export type DbBook = typeof  booksTable.$inferSelect
export type DbNewBook = typeof booksTable.$inferInsert