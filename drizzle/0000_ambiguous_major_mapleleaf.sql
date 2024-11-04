CREATE TABLE IF NOT EXISTS "Article" (
	"article_id" serial PRIMARY KEY NOT NULL,
	"course_chapter_id" integer NOT NULL,
	"author_id" integer NOT NULL,
	"image_url" varchar,
	"content" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "CourseChapters" (
	"course_chapter_id" serial PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"author_id" integer NOT NULL,
	"title" varchar NOT NULL,
	"type" varchar NOT NULL,
	"estimated_time" integer NOT NULL,
	"order" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "CourseEnrollments" (
	"enrollment_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"course_id" integer NOT NULL,
	"current_chapter_id" integer NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"enrolled_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Courses" (
	"course_id" serial PRIMARY KEY NOT NULL,
	"author_id" integer NOT NULL,
	"name" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"category_id" integer NOT NULL,
	"short_description" varchar NOT NULL,
	"long_description" varchar NOT NULL,
	"image_url" varchar NOT NULL,
	"resources_url" varchar,
	"price" real DEFAULT 0 NOT NULL,
	"is_draft" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_updated" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "Courses_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "CoursesCategories" (
	"category_id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	CONSTRAINT "CoursesCategories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "CoursesReviews" (
	"review_id" serial PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"rating" integer NOT NULL,
	"comment" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Media" (
	"media_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"friendly_name" varchar NOT NULL,
	"alt_text" varchar,
	"url" varchar NOT NULL,
	"type" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "QuizQuestions" (
	"quiz_question_id" serial PRIMARY KEY NOT NULL,
	"course_chapter_id" integer NOT NULL,
	"author_id" integer NOT NULL,
	"order" integer NOT NULL,
	"question" varchar NOT NULL,
	"options" jsonb NOT NULL,
	"correct_option_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ResetPasswordCodes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"code" varchar NOT NULL,
	"used" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"avatar_url" varchar,
	"role" varchar DEFAULT 'user' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "Users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "VerificationCodes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"code" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Article" ADD CONSTRAINT "Article_course_chapter_id_CourseChapters_course_chapter_id_fk" FOREIGN KEY ("course_chapter_id") REFERENCES "public"."CourseChapters"("course_chapter_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Article" ADD CONSTRAINT "Article_author_id_Users_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."Users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "CourseChapters" ADD CONSTRAINT "CourseChapters_course_id_Courses_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."Courses"("course_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "CourseChapters" ADD CONSTRAINT "CourseChapters_author_id_Users_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."Users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "CourseEnrollments" ADD CONSTRAINT "CourseEnrollments_user_id_Users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "CourseEnrollments" ADD CONSTRAINT "CourseEnrollments_course_id_Courses_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."Courses"("course_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "CourseEnrollments" ADD CONSTRAINT "CourseEnrollments_current_chapter_id_CourseChapters_course_chapter_id_fk" FOREIGN KEY ("current_chapter_id") REFERENCES "public"."CourseChapters"("course_chapter_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Courses" ADD CONSTRAINT "Courses_author_id_Users_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."Users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Courses" ADD CONSTRAINT "Courses_category_id_CoursesCategories_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."CoursesCategories"("category_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "CoursesReviews" ADD CONSTRAINT "CoursesReviews_course_id_Courses_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."Courses"("course_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "CoursesReviews" ADD CONSTRAINT "CoursesReviews_user_id_Users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Media" ADD CONSTRAINT "Media_user_id_Users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "QuizQuestions" ADD CONSTRAINT "QuizQuestions_course_chapter_id_CourseChapters_course_chapter_id_fk" FOREIGN KEY ("course_chapter_id") REFERENCES "public"."CourseChapters"("course_chapter_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "QuizQuestions" ADD CONSTRAINT "QuizQuestions_author_id_Users_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."Users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ResetPasswordCodes" ADD CONSTRAINT "ResetPasswordCodes_user_id_Users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "VerificationCodes" ADD CONSTRAINT "VerificationCodes_user_id_Users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
