import { usersTable} from "../schema";

export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;
