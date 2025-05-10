import { pgTable, varchar } from "drizzle-orm/pg-core";

export const languagesTable = pgTable("languages", {
  code: varchar("code", { length: 5 }).primaryKey(), // ISO 639-1, например "en", "ru"
  name: varchar("name", { length: 100 }).notNull(),  // English, Русский, Español и т.п.
  nativeName: varchar("native_name", { length: 100 }),
  countryCode: varchar("country_code", { length: 2 }),
});