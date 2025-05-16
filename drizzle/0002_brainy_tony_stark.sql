CREATE TABLE "series" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" varchar(1024),
	"cover_url" varchar(255),
	"rating" real DEFAULT 0 NOT NULL,
	"average_rating" real DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "series_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "series_to_authors" (
	"series_id" integer NOT NULL,
	"author_id" integer NOT NULL,
	CONSTRAINT "series_to_authors_series_id_author_id_pk" PRIMARY KEY("series_id","author_id")
);
--> statement-breakpoint
ALTER TABLE "book_series" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "book_series" CASCADE;--> statement-breakpoint
ALTER TABLE "book_series_ratings" RENAME TO "series_ratings";--> statement-breakpoint
ALTER TABLE "authors" RENAME COLUMN "language" TO "language_code";--> statement-breakpoint
ALTER TABLE "series_ratings" RENAME COLUMN "book_series_id" TO "series_id";--> statement-breakpoint
ALTER TABLE "books" RENAME COLUMN "book_series_id" TO "series_id";--> statement-breakpoint
ALTER TABLE "series_ratings" DROP CONSTRAINT "unique_user_series";--> statement-breakpoint
ALTER TABLE "series_ratings" DROP CONSTRAINT "rating_check1";--> statement-breakpoint
ALTER TABLE "series_ratings" DROP CONSTRAINT "book_series_ratings_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "series_ratings" DROP CONSTRAINT "book_series_ratings_book_series_id_book_series_id_fk";
--> statement-breakpoint
ALTER TABLE "books" DROP CONSTRAINT "books_book_series_id_book_series_id_fk";
--> statement-breakpoint
ALTER TABLE "books" ALTER COLUMN "rating" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "original_title" varchar(255);--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "age_limit" integer;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "is_published" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "is_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "created_by_user_id" integer;--> statement-breakpoint
ALTER TABLE "series_to_authors" ADD CONSTRAINT "series_to_authors_series_id_series_id_fk" FOREIGN KEY ("series_id") REFERENCES "public"."series"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "series_to_authors" ADD CONSTRAINT "series_to_authors_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authors" ADD CONSTRAINT "authors_language_code_languages_code_fk" FOREIGN KEY ("language_code") REFERENCES "public"."languages"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "series_ratings" ADD CONSTRAINT "series_ratings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "series_ratings" ADD CONSTRAINT "series_ratings_series_id_series_id_fk" FOREIGN KEY ("series_id") REFERENCES "public"."series"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_series_id_series_id_fk" FOREIGN KEY ("series_id") REFERENCES "public"."series"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "books" DROP COLUMN "average_rating";--> statement-breakpoint
ALTER TABLE "series_ratings" ADD CONSTRAINT "unique_user_series" UNIQUE("user_id","series_id");--> statement-breakpoint
ALTER TABLE "series_ratings" ADD CONSTRAINT "rating_check1" CHECK ("series_ratings"."value" >= 0 AND "series_ratings"."value" <= 10);