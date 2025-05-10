CREATE TABLE "book_to_genres" (
	"book_id" integer NOT NULL,
	"genre_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_achievements" DROP CONSTRAINT "unique_user_series";--> statement-breakpoint
ALTER TABLE "book_to_genres" ADD CONSTRAINT "book_to_genres_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_to_genres" ADD CONSTRAINT "book_to_genres_genre_id_genres_id_fk" FOREIGN KEY ("genre_id") REFERENCES "public"."genres"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_achievements" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "user_achievements" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "user_achievements" ADD CONSTRAINT "unique_user_achievement" UNIQUE("user_id","achievement_id");