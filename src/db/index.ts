import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { languagesTable } from "./schema/languages";
import { languageData } from "./seeds/permanetDate/languages";
import { genreData } from "./seeds/permanetDate/genres";
import * as schema from "./schema";
import { achievementsTable } from "./schema/achievements";
import { achievementsData } from "./seeds/permanetDate/achievements";
import { reset } from "drizzle-seed";
import { mockSeedsRun } from "./seeds";

const db = drizzle(process.env.DATABASE_URL!, { schema });

await reset(db, schema);
// real seeds
await db.insert(languagesTable).values(languageData).onConflictDoNothing();
await db.insert(schema.genresTable).values(genreData).onConflictDoNothing();
await db
  .insert(achievementsTable)
  .values(achievementsData)
  .onConflictDoNothing();

mockSeedsRun(db);
export default db;
