import {
  pgTable,
  integer,
  unique,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { achievementsTable } from "./achievements";
import { relations } from "drizzle-orm";

export const userToAchievementsTable = pgTable(
  "user_achievements",
  {
    userId: integer("user_id")
      .references(() => usersTable.id)
      .notNull(),
    achievementId: integer("achievement_id")
      .references(() => achievementsTable.id)
      .notNull(),
  },
  (table) => [
    unique("unique_user_achievement").on(table.userId, table.achievementId),
  ]
);

export const userAchievementsRelations = relations(
  userToAchievementsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [userToAchievementsTable.userId],
      references: [usersTable.id],
    }),
    achievement: one(achievementsTable, {
      fields: [userToAchievementsTable.achievementId],
      references: [achievementsTable.id],
    }),
  })
);
