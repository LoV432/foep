import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

if (!process.env.DB_LINK) {
	throw new Error('DB_LINK is not set');
}

export const pool = new Pool({
	ssl: false,
	connectionString: process.env.DB_LINK
});

export const db = drizzle(pool, { schema });
