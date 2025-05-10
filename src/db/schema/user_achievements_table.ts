import {
  pgTable,
  serial,
  integer,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { achievementsTable } from "./achievements";
import { relations } from "drizzle-orm";

export const userAchievementsTable = pgTable(
  "user_achievements",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .references(() => usersTable.id)
      .notNull(),
    achievementId: integer("achievement_id")
      .references(() => achievementsTable.id)
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    unique("unique_user_series").on(table.userId, table.achievementId),
  ]
);

export const userAchievementsRelations = relations(
  userAchievementsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [userAchievementsTable.userId],
      references: [usersTable.id],
    }),
    achievement: one(achievementsTable, {
      fields: [userAchievementsTable.achievementId],
      references: [achievementsTable.id],
    }),
  })
);
