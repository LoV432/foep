import {
	pgTable,
	varchar,
	serial,
	boolean,
	integer,
	timestamp,
	real
} from 'drizzle-orm/pg-core';

// DB Schema. I am using drizzle just to make everything a bit more type-safe.
// I have provided the raw SQL below each table for reference.

export const Users = pgTable('Users', {
	user_id: serial('user_id').primaryKey(),
	name: varchar('name').notNull(),
	email: varchar('email').notNull().unique(),
	password: varchar('password').notNull(),
	email_verified: boolean('email_verified').notNull().default(false),
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
		.references(() => Courses.course_id)
		.notNull(),
	user_id: integer('user_id')
		.references(() => Users.user_id)
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
	name: varchar('name').notNull().unique(), // I will probably use this as the slug too
	category_id: integer('category_id') // TODO: Allow multiple categories
		.references(() => CoursesCategories.category_id)
		.notNull(),
	description: varchar('description').notNull(),
	image_url: varchar('image_url').notNull(), // TODO: All media will have separate table and this will be a reference to that media
	price: real('price'),
	created_at: timestamp('created_at', { withTimezone: true })
		.notNull()
		.defaultNow(),
	last_updated: timestamp('last_updated', { withTimezone: true })
		.notNull()
		.defaultNow()
});
