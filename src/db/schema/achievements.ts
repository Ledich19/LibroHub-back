import {
  serial,
  pgTable,
  timestamp,
  varchar,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { userToAchievementsTable } from "./user_to_achievements_table";

export const achievementsTable = pgTable("achievements", {
  id: serial("id").primaryKey(),
  achievementName: varchar("achievement_name", { length: 255 }).notNull(),
  description: varchar("description", { length: 1024 }).notNull(), // Подробности о достижении
  imageUrl: varchar("image_url", { length: 512 }), // Картинка (например, медалька)
  condition: varchar("condition", { length: 512 }), // Условие получения достижения
  conditionKey: varchar("condition_key", { length: 128 }),
  type: varchar("type", { length: 100 }).default("general").notNull(),
  isActive: boolean("is_active").default(true), // Флаг активности (если ачивку нужно скрыть/отключить)
  points: integer("points").default(0),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const achievementsRelations = relations(
  achievementsTable,
  ({ one, many }) => ({
    achievements: many(userToAchievementsTable),
  })
);
