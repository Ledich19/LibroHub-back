import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { languages } from "./schema/languages";
import { languageData } from "./seeds/languages";
import { genres } from "./schema/genres";
import { genreData } from "./seeds/genres";
import * as schema from "./schema";

const db = drizzle(process.env.DATABASE_URL!, { schema });

await db.insert(languages).values(languageData).onConflictDoNothing();
await db.insert(genres).values(genreData).onConflictDoNothing();

export default db;
