CREATE TYPE "public"."author_status" AS ENUM('active', 'retired', 'deceased', 'banned');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TABLE "achievements" (
	"id" serial PRIMARY KEY NOT NULL,
	"achievement_name" varchar(255) NOT NULL,
	"description" varchar(1024) NOT NULL,
	"image_url" varchar(512),
	"condition" varchar(512),
	"condition_key" varchar(128),
	"type" varchar(100) DEFAULT 'general' NOT NULL,
	"is_active" boolean DEFAULT true,
	"points" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "author_awards" (
	"author_id" integer NOT NULL,
	"award_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "authors" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"middle_name" varchar(255),
	"last_name" varchar(255) NOT NULL,
	"pen_name" varchar(255),
	"bio" text,
	"gender" "gender",
	"birth_date" timestamp,
	"death_date" timestamp,
	"status" "author_status" DEFAULT 'active' NOT NULL,
	"country" varchar(255),
	"language" varchar(255),
	"photo_url" varchar(255),
	"website" varchar(255),
	"twitter" varchar(255),
	"facebook" varchar(255),
	"instagram" varchar(255),
	"linkedin" varchar(255),
	"email" varchar(320),
	"slug" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "authors_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "awards" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"year" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "book_authors" (
	"book_id" integer NOT NULL,
	"author_id" integer NOT NULL,
	CONSTRAINT "book_authors_book_id_author_id_pk" PRIMARY KEY("book_id","author_id")
);
--> statement-breakpoint
CREATE TABLE "book_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"book_id" integer,
	"content" text NOT NULL,
	"rating" integer DEFAULT 0 NOT NULL,
	"helpful_count" integer DEFAULT 0,
	"unhelpful_count" integer DEFAULT 0,
	"tags" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "book_reviews_user_id_book_id_unique" UNIQUE("user_id","book_id"),
	CONSTRAINT "rating_check1" CHECK ("book_reviews"."rating" >= 0 AND "book_reviews"."rating" <= 10)
);
--> statement-breakpoint
CREATE TABLE "book_series_ratings" (
	"id" serial PRIMARY KEY NOT NULL,
	"value" integer NOT NULL,
	"user_id" integer NOT NULL,
	"book_series_id" integer NOT NULL,
	CONSTRAINT "unique_user_series" UNIQUE("user_id","book_series_id"),
	CONSTRAINT "rating_check1" CHECK ("book_series_ratings"."value" >= 0 AND "book_series_ratings"."value" <= 10)
);
--> statement-breakpoint
CREATE TABLE "book_series" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"rating" real DEFAULT 0 NOT NULL,
	"average_rating" real DEFAULT 0 NOT NULL,
	"slug" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "book_series_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "books" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"rating" real DEFAULT 0 NOT NULL,
	"language_code" varchar(5),
	"published_date" date,
	"publisher" varchar(255),
	"page_count" integer,
	"series_index" integer DEFAULT 0,
	"book_series_id" integer,
	"total_reviews" integer DEFAULT 0,
	"average_rating" double precision DEFAULT 0,
	"isbn" varchar(20),
	"slug" varchar(255) NOT NULL,
	"cover_url" varchar(255),
	"preview_url" varchar(255),
	"download_url" varchar(255),
	CONSTRAINT "books_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "book_genres" (
	"book_id" integer NOT NULL,
	"genre_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "genres" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	CONSTRAINT "genres_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "languages" (
	"code" varchar(5) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"native_name" varchar(100),
	"country_code" varchar(2)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"username" varchar(50),
	"name" varchar(255),
	"preferences" json,
	"is_admin" boolean DEFAULT false NOT NULL,
	"avatar_url" varchar(512),
	"bio" varchar(1024),
	"total_points" integer DEFAULT 0 NOT NULL,
	"total_reviews" integer DEFAULT 0 NOT NULL,
	"total_books_read" integer DEFAULT 0 NOT NULL,
	"last_login_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "user_achievements" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"achievement_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_user_series" UNIQUE("user_id","achievement_id")
);
--> statement-breakpoint
ALTER TABLE "author_awards" ADD CONSTRAINT "author_awards_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "author_awards" ADD CONSTRAINT "author_awards_award_id_awards_id_fk" FOREIGN KEY ("award_id") REFERENCES "public"."awards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_authors" ADD CONSTRAINT "book_authors_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_authors" ADD CONSTRAINT "book_authors_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_reviews" ADD CONSTRAINT "book_reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_reviews" ADD CONSTRAINT "book_reviews_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_series_ratings" ADD CONSTRAINT "book_series_ratings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_series_ratings" ADD CONSTRAINT "book_series_ratings_book_series_id_book_series_id_fk" FOREIGN KEY ("book_series_id") REFERENCES "public"."book_series"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_language_code_languages_code_fk" FOREIGN KEY ("language_code") REFERENCES "public"."languages"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_book_series_id_book_series_id_fk" FOREIGN KEY ("book_series_id") REFERENCES "public"."book_series"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_genres" ADD CONSTRAINT "book_genres_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_genres" ADD CONSTRAINT "book_genres_genre_id_genres_id_fk" FOREIGN KEY ("genre_id") REFERENCES "public"."genres"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_achievement_id_achievements_id_fk" FOREIGN KEY ("achievement_id") REFERENCES "public"."achievements"("id") ON DELETE no action ON UPDATE no action;