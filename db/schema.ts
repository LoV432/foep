import {
	pgTable,
	varchar,
	serial,
	boolean,
	integer,
	timestamp
} from 'drizzle-orm/pg-core';

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

export const VerificationCodes = pgTable('VerificationCodes', {
	id: serial('id').primaryKey(),
	user_id: integer('user_id')
		.references(() => Users.user_id)
		.notNull(),
	code: varchar('code').notNull(),
	created_at: timestamp('created_at', { withTimezone: true })
		.notNull()
		.defaultNow()
});
