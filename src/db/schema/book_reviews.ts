import {
  serial,
  pgTable,
  integer,
  text,
  timestamp,
  unique,
  check,
  varchar,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { booksTable } from "./books";
import { relations, sql } from "drizzle-orm";

export const bookReviewsTable = pgTable(
  "book_reviews",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => usersTable.id),
    bookId: integer("book_id").references(() => booksTable.id),

    content: text("content").notNull(),
    rating: integer("rating").notNull().default(0),

    helpfulCount: integer("helpful_count").default(0), // Лайки
    unhelpfulCount: integer("unhelpful_count").default(0), // Дизлайки
    tags: varchar("tags", { length: 255 }), // Метки для отзыва

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    unique().on(table.userId, table.bookId),
    check("rating_check1", sql`${table.rating} >= 0 AND ${table.rating} <= 10`),
  ]
);

export const bookRatingsRelations = relations(bookReviewsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [bookReviewsTable.userId],
    references: [usersTable.id],
  }),
  book: one(booksTable, {
    fields: [bookReviewsTable.bookId],
    references: [booksTable.id],
  }),
}));
