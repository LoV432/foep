import { pgTable, varchar, date, serial, boolean } from 'drizzle-orm/pg-core';

export const Users = pgTable('Users', {
	user_id: serial('user_id').primaryKey(),
	name: varchar('name').notNull(),
	email: varchar('email').notNull().unique(),
	password: varchar('password').notNull(),
	email_verified: boolean('email_verified').notNull().default(false),
	created_at: date('created_at').notNull().defaultNow()
});
