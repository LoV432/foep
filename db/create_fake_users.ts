import { loadEnvConfig } from '@next/env';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
loadEnvConfig(process.cwd());

const pool = new Pool({
	ssl: false,
	connectionString: process.env.DB_LINK
});

const db = drizzle(pool, { schema });

async function main() {
	const instructors = Array.from({ length: 10 }, () => ({
		name: faker.person.fullName(),
		email: faker.internet.email(),
		password: bcrypt.hashSync(faker.internet.password(), 10),
		email_verified: true,
		role: 'instructor' as const
	}));

	await db.insert(schema.Users).values(instructors);
}

main()
	.catch(console.error)
	.finally(() => pool.end());
