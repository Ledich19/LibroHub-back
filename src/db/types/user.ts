import { usersTable} from "../schema";

export type DbUser = typeof usersTable.$inferSelect;
export type NewDbUser = typeof usersTable.$inferInsert;