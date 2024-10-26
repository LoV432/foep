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

async function createCategories() {
	await db
		.insert(schema.CoursesCategories)
		.values([
			{ name: 'Web Development' },
			{ name: 'Programming' },
			{ name: 'Data Science' },
			{ name: 'Design' },
			{ name: 'Business' }
		]);
}

async function createInstructors() {
	await db.insert(schema.Users).values({
		user_id: 1,
		name: 'Admin',
		email: 'admin@example.com',
		password: bcrypt.hashSync('password', 10),
		email_verified: true,
		role: 'admin'
	});

	const instructors = Array.from({ length: 10 }, () => ({
		name: faker.person.fullName(),
		email: faker.internet.email(),
		password: bcrypt.hashSync(faker.internet.password(), 10),
		email_verified: true,
		role: 'instructor' as const
	}));

	await db.insert(schema.Users).values(instructors);
}

async function createCourses() {
	const categories = await db.select().from(schema.CoursesCategories);
	const instructors = await db.select().from(schema.Users);

	const courses = Array.from({ length: 50 }, () => {
		const category = faker.helpers.arrayElement(categories);
		const instructor = faker.helpers.arrayElement(instructors);
		return {
			name: faker.lorem.words({ min: 3, max: 6 }),
			short_description: faker.lorem.paragraph(),
			long_description: faker.lorem.paragraph(),
			author_id: instructor.user_id,
			price: parseFloat(faker.commerce.price({ min: 9.99, max: 199.99 })),
			image_url: faker.image.urlPicsumPhotos(),
			category_id: category.category_id,
			slug: faker.helpers
				.slugify(faker.lorem.words({ min: 3, max: 6 }))
				.toLowerCase(),
			created_at: faker.date.past(),
			last_updated: faker.date.recent()
		};
	});

	await db.insert(schema.Courses).values(courses);
}

async function createReviews() {
	const courses = await db.select().from(schema.Courses);
	const users = await db.select().from(schema.Users);

	const reviews = courses.flatMap((course) =>
		Array.from({ length: faker.number.int({ min: 5, max: 20 }) }, () => {
			const user = faker.helpers.arrayElement(users);
			return {
				course_id: course.course_id,
				user_id: user.user_id,
				rating: faker.number.int({ min: 1, max: 5 }),
				comment: faker.lorem.paragraph(),
				created_at: faker.date.recent()
			};
		})
	);

	await db.insert(schema.CoursesReviews).values(reviews);
}

async function main() {
	await db.delete(schema.Courses).execute();
	await db.delete(schema.CoursesReviews).execute();
	await db.delete(schema.CoursesCategories).execute();
	await db.delete(schema.Users).execute();

	await createCategories();
	await createInstructors();
	await createCourses();
	await createReviews();

	console.log('Fake data generation completed.');
}

main()
	.catch(console.error)
	.finally(() => pool.end());
