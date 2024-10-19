import {
	pgTable,
	varchar,
	serial,
	boolean,
	integer,
	timestamp
} from 'drizzle-orm/pg-core';

// DB Schema. I am using drizzle just to make everything a bit more type-safe.
// I have provided the raw SQL below each table for reference.

export const Users = pgTable('Users', {
	user_id: serial('user_id').primaryKey(),
	name: varchar('name').notNull(),
	email: varchar('email').notNull().unique(),
	password: varchar('password').notNull(),
	email_verified: boolean('email_verified').notNull().default(false),
	created_at: timestamp('created_at', { withTimezone: true })
		.notNull()
		.defaultNow()
});
// CREATE TABLE IF NOT EXISTS "Users" (
// 	"user_id" serial PRIMARY KEY NOT NULL,
// 	"name" varchar NOT NULL,
// 	"email" varchar NOT NULL UNIQUE,
// 	"password" varchar NOT NULL,
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
