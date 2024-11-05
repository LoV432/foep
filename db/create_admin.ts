import { loadEnvConfig } from '@next/env';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import bcrypt from 'bcrypt';
loadEnvConfig(process.cwd());

const pool = new Pool({
	ssl: false,
	connectionString: process.env.DB_LINK
});

const db = drizzle(pool, { schema });

async function main() {
	await db.insert(schema.Users).values({
		user_id: 1,
		name: 'Admin',
		email: 'admin@example.com',
		password: bcrypt.hashSync('password', 10),
		email_verified: true,
		role: 'admin'
	});
	console.log('Admin user created.');
}

main()
	.catch(console.error)
	.finally(() => pool.end());
