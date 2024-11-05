import { loadEnvConfig } from '@next/env';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
loadEnvConfig(process.cwd());

const pool = new Pool({
	ssl: false,
	connectionString: process.env.DB_LINK
});

const db = drizzle(pool, { schema });

async function main() {
	await db.delete(schema.Courses).execute();
	await db.delete(schema.CoursesReviews).execute();
	await db.delete(schema.CoursesCategories).execute();
	console.log('Courses deleted.');
}

main()
	.catch(console.error)
	.finally(() => pool.end());
