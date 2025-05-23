import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { languagesTable } from "./schema/languages";
import { languageData } from "./seeds/permanetDate/languages";
import { genreData } from "./seeds/permanetDate/genres";
import { authorsSeedData } from "./seeds/permanetDate/authors";
import { seriesData } from "./seeds/permanetDate/series";
import { seriesToAuthorsData } from "./seeds/permanetDate/series_to_authors";
import { booksData } from "./seeds/permanetDate/books";
import { booksToAuthorsData } from "./seeds/permanetDate/books_to_authors";
import * as schema from "./schema";
import { achievementsTable } from "./schema/achievements";
import { achievementsData } from "./seeds/permanetDate/achievements";
import { reset } from "drizzle-seed";
import { mockSeedsRun } from "./seeds";
import { usersData } from "./seeds/permanetDate/users";

const db = drizzle(process.env.DATABASE_URL!, { schema });

await reset(db, schema);
// real seeds
await db.insert(schema.usersTable).values(usersData).onConflictDoNothing();
await db.insert(languagesTable).values(languageData).onConflictDoNothing();
await db.insert(schema.genresTable).values(genreData).onConflictDoNothing();
await db
  .insert(achievementsTable)
  .values(achievementsData)
  .onConflictDoNothing();
await db.insert(schema.authorsTable).values(authorsSeedData).onConflictDoNothing();
await db.insert(schema.seriesTable).values(seriesData).onConflictDoNothing();
await db.insert(schema.seriesToAuthorsTable).values(seriesToAuthorsData).onConflictDoNothing();
await db.insert(schema.booksTable).values(booksData).onConflictDoNothing();
await db.insert(schema.booksToAuthorsTable).values(booksToAuthorsData).onConflictDoNothing();



// mockSeedsRun(db);
export default db;
