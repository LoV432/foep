import {
	pgTable,
	varchar,
	serial,
	boolean,
	integer,
	timestamp,
	real,
	jsonb
} from 'drizzle-orm/pg-core';

// DB Schema. I am using drizzle just to make everything a bit more type-safe.
// I have provided the raw SQL below each table for reference.

export const Users = pgTable('Users', {
	user_id: serial('user_id').primaryKey(),
	name: varchar('name').notNull(),
	email: varchar('email').notNull().unique(),
	password: varchar('password').notNull(),
	email_verified: boolean('email_verified').notNull().default(false),
	avatar_url: varchar('avatar_url'),
	role: varchar('role', { enum: ['user', 'admin', 'instructor'] })
		.notNull()
		.default('user'),
	created_at: timestamp('created_at', { withTimezone: true })
		.notNull()
		.defaultNow()
});
// CREATE TABLE IF NOT EXISTS "Users" (
// 	"user_id" serial PRIMARY KEY NOT NULL,
// 	"name" varchar NOT NULL,
// 	"email" varchar NOT NULL UNIQUE,
// 	"password" varchar NOT NULL,
// 	"role" varchar NOT NULL DEFAULT 'user', // the enum is only enforced in the schema, not in the DB
// 	"email_verified" boolean DEFAULT false NOT NULL,
// 	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
// );

export const VerificationCodes = pgTable('VerificationCodes', {
	id: serial('id').primaryKey(),
	user_id: integer('user_id')
		.references(() => Users.user_id, { onDelete: 'cascade' })
		.notNull(),
	code: varchar('code').notNull(),
	created_at: timestamp('created_at', { withTimezone: true })
		.notNull()
		.defaultNow()
});
// CREATE TABLE IF NOT EXISTS "VerificationCodes" (
// 	"id" serial PRIMARY KEY NOT NULL,
// 	"user_id" integer NOT NULL,
// 	"code" varchar NOT NULL,
// 	"created_at" timestamp with time zone DEFAULT now() NOT NULL
// 	CONSTRAINT "VerificationCodes_user_id_Users_user_id_fk"
// 		FOREIGN KEY ("user_id")
// 			REFERENCES "Users"("user_id")
// 				ON DELETE CASCADE
// );

export const ResetPasswordCodes = pgTable('ResetPasswordCodes', {
	id: serial('id').primaryKey(),
	user_id: integer('user_id')
		.references(() => Users.user_id, { onDelete: 'cascade' })
		.notNull(),
	code: varchar('code').notNull(),
	used: boolean('used').notNull().default(false),
	created_at: timestamp('created_at', { withTimezone: true })
		.notNull()
		.defaultNow()
});
// CREATE TABLE IF NOT EXISTS "ResetPasswordCodes" (
// 	"id" serial PRIMARY KEY NOT NULL,
// 	"user_id" integer NOT NULL,
// 	"code" varchar NOT NULL,
// 	"used" boolean DEFAULT false NOT NULL,
// 	"created_at" timestamp with time zone DEFAULT now() NOT NULL
// 	CONSTRAINT "ResetPasswordCodes_user_id_Users_user_id_fk"
// 		FOREIGN KEY ("user_id")
// 			REFERENCES "Users"("user_id")
// 				ON DELETE CASCADE
// );

// ====== Course Tables ======
export const CoursesCategories = pgTable('CoursesCategories', {
	category_id: serial('category_id').primaryKey(),
	name: varchar('name').notNull().unique()
});

export const CoursesReviews = pgTable('CoursesReviews', {
	review_id: serial('review_id').primaryKey(),
	course_id: integer('course_id')
		.references(() => Courses.course_id, { onDelete: 'cascade' })
		.notNull(),
	user_id: integer('user_id')
		.references(() => Users.user_id, { onDelete: 'cascade' })
		.notNull(),
	rating: integer('rating').notNull(),
	comment: varchar('comment')
});

export const Media = pgTable('Media', {
	media_id: serial('media_id').primaryKey(),
	user_id: integer('user_id')
		.references(() => Users.user_id)
		.notNull(),
	friendly_name: varchar('friendly_name').notNull(),
	alt_text: varchar('alt_text'),
	url: varchar('url').notNull(),
	type: varchar('type').notNull(),
	created_at: timestamp('created_at', { withTimezone: true })
		.notNull()
		.defaultNow()
});

export const Courses = pgTable('Courses', {
	course_id: serial('course_id').primaryKey(),
	author_id: integer('author_id')
		.references(() => Users.user_id)
		.notNull(),
	name: varchar('name').notNull(),
	slug: varchar('slug').notNull().unique(),
	category_id: integer('category_id') // TODO: Allow multiple categories
		.references(() => CoursesCategories.category_id)
		.notNull(),
	short_description: varchar('short_description').notNull(),
	long_description: varchar('long_description').notNull(),
	image_url: varchar('image_url').notNull(),
	price: real('price').notNull().default(0),
	is_draft: boolean('is_draft').notNull().default(false),
	created_at: timestamp('created_at', { withTimezone: true })
		.notNull()
		.defaultNow(),
	last_updated: timestamp('last_updated', { withTimezone: true })
		.notNull()
		.defaultNow()
});

export const CourseChapters = pgTable('CourseChapters', {
	course_chapter_id: serial('course_chapter_id').primaryKey(),
	course_id: integer('course_id')
		.references(() => Courses.course_id, { onDelete: 'cascade' })
		.notNull(),
	author_id: integer('author_id')
		.references(() => Users.user_id)
		.notNull(),
	title: varchar('title').notNull(),
	type: varchar('type', { enum: ['article', 'quiz'] }).notNull(),
	estimated_time: integer('estimated_time').notNull(),
	order: integer('order').notNull(),
	created_at: timestamp('created_at', { withTimezone: true })
		.notNull()
		.defaultNow()
});

export const Article = pgTable('Article', {
	article_id: serial('article_id').primaryKey(),
	course_chapter_id: integer('course_chapter_id')
		.references(() => CourseChapters.course_chapter_id, { onDelete: 'cascade' })
		.notNull(),
	author_id: integer('author_id')
		.references(() => Users.user_id)
		.notNull(),
	image_url: varchar('image_url'),
	content: varchar('content').notNull(),
	created_at: timestamp('created_at', { withTimezone: true })
		.notNull()
		.defaultNow()
});

export const Quiz = pgTable('Quiz', {
	quiz_id: serial('quiz_id').primaryKey(),
	course_chapter_id: integer('course_chapter_id')
		.references(() => CourseChapters.course_chapter_id, { onDelete: 'cascade' })
		.notNull(),
	author_id: integer('author_id')
		.references(() => Users.user_id)
		.notNull(),
	created_at: timestamp('created_at', { withTimezone: true })
		.notNull()
		.defaultNow()
});

type QuizOption = {
	id: string;
	text: string;
};

export const QuizQuestions = pgTable('QuizQuestions', {
	quiz_question_id: serial('quiz_question_id').primaryKey(),
	quiz_id: integer('quiz_id')
		.references(() => Quiz.quiz_id, { onDelete: 'cascade' })
		.notNull(),
	author_id: integer('author_id')
		.references(() => Users.user_id)
		.notNull(),
	question: varchar('question').notNull(),
	// I dont really like the idea of using jsonb for this
	// It should be a table on its own but that comes with a lot of other problems
	// Right now i am not sure if this will even work but we will see, I guess
	options: jsonb('options').$type<QuizOption[]>().notNull(),
	// I cant even guarantee that this id even exists in the options array
	correct_option_id: varchar('correct_option_id').notNull(),
	created_at: timestamp('created_at', { withTimezone: true })
		.notNull()
		.defaultNow()
});
