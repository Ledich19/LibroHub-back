import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { languages } from "./schema/languages";
import { languageData } from "./seeds/languages";
import { genres } from "./schema/genres";
import { genreData } from "./seeds/genres";

const db = drizzle(process.env.DATABASE_URL!);

await db.insert(languages).values(languageData);
await db.insert(genres).values(genreData);
