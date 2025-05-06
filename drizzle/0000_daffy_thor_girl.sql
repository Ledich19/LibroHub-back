CREATE TABLE "book_ratings" (
	"id" serial PRIMARY KEY NOT NULL,
	"value" integer NOT NULL,
	"user_id" integer NOT NULL,
	"book_id" integer NOT NULL,
	CONSTRAINT "user_book_unique" UNIQUE("user_id","book_id")
);
--> statement-breakpoint
CREATE TABLE "book_series_ratings" (
	"id" serial PRIMARY KEY NOT NULL,
	"value" integer NOT NULL,
	"user_id" integer NOT NULL,
	"book_series_id" integer NOT NULL,
	CONSTRAINT "unique_user_series" UNIQUE("user_id","book_series_id")
);
--> statement-breakpoint
CREATE TABLE "book_series" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"rating" real DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "books" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"rating" real DEFAULT 0 NOT NULL,
	"book_series_id" integer
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"name" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "book_ratings" ADD CONSTRAINT "book_ratings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_ratings" ADD CONSTRAINT "book_ratings_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_series_ratings" ADD CONSTRAINT "book_series_ratings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_series_ratings" ADD CONSTRAINT "book_series_ratings_book_series_id_book_series_id_fk" FOREIGN KEY ("book_series_id") REFERENCES "public"."book_series"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_book_series_id_book_series_id_fk" FOREIGN KEY ("book_series_id") REFERENCES "public"."book_series"("id") ON DELETE no action ON UPDATE no action;