import { loadEnvConfig } from '@next/env';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { faker } from '@faker-js/faker';
loadEnvConfig(process.cwd());

const pool = new Pool({
	ssl: false,
	connectionString: process.env.DB_LINK
});

const db = drizzle(pool, { schema });

async function createCategories() {
	try {
		await db
			.insert(schema.CoursesCategories)
			.values([
				{ name: 'Web Development' },
				{ name: 'Programming' },
				{ name: 'Data Science' },
				{ name: 'Design' },
				{ name: 'Business' }
			]);
	} catch (error) {
		console.log('Error creating categories. Categories already exist.');
	}
}

async function createCourses() {
	const categories = await db.select().from(schema.CoursesCategories);
	const instructors = await db.select().from(schema.Users);
	if (categories.length === 0 || instructors.length === 0) {
		throw new Error('No categories or instructors found.');
	}
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
	if (courses.length === 0 || users.length === 0) {
		throw new Error('No courses or users found.');
	}
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
	await createCategories();
	await createCourses();
	await createReviews();

	console.log('Fake data generation completed.');
}

main()
	.catch(console.error)
	.finally(() => pool.end());
