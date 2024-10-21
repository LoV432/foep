import { loadEnvConfig } from '@next/env';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { eq } from 'drizzle-orm';

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

async function createCourses() {
	await db.insert(schema.Courses).values([
		{
			name: 'Introduction to React',
			description: 'Learn the basics of React and build your first app.',
			author_id: (
				await db
					.select()
					.from(schema.Users)
					.where(eq(schema.Users.email, 'monib619@gmail.com'))
			)[0].user_id,
			price: 49.99,
			image_url: 'https://picsum.photos/600?random=1',
			category_id: (
				await db
					.select()
					.from(schema.CoursesCategories)
					.where(eq(schema.CoursesCategories.name, 'Web Development'))
			)[0].category_id
		},
		{
			name: 'Advanced JavaScript Techniques',
			description: 'Master advanced concepts in JavaScript programming.',
			author_id: (
				await db
					.select()
					.from(schema.Users)
					.where(eq(schema.Users.email, 'monib619@gmail.com'))
			)[0].user_id,
			price: 79.99,
			image_url: 'https://picsum.photos/600?random=2',
			category_id: (
				await db
					.select()
					.from(schema.CoursesCategories)
					.where(eq(schema.CoursesCategories.name, 'Programming'))
			)[0].category_id
		},
		{
			name: 'Python for Data Science',
			description:
				'Learn Python programming for data analysis and visualization.',
			author_id: (
				await db
					.select()
					.from(schema.Users)
					.where(eq(schema.Users.email, 'monib619@gmail.com'))
			)[0].user_id,
			price: 69.99,
			image_url: 'https://picsum.photos/600?random=3',
			category_id: (
				await db
					.select()
					.from(schema.CoursesCategories)
					.where(eq(schema.CoursesCategories.name, 'Data Science'))
			)[0].category_id
		},
		{
			name: 'UI/UX Design Fundamentals',
			description:
				'Master the principles of user interface and user experience design.',
			author_id: (
				await db
					.select()
					.from(schema.Users)
					.where(eq(schema.Users.email, 'monib619@gmail.com'))
			)[0].user_id,
			price: 59.99,
			image_url: 'https://picsum.photos/600?random=4',
			category_id: (
				await db
					.select()
					.from(schema.CoursesCategories)
					.where(eq(schema.CoursesCategories.name, 'Design'))
			)[0].category_id
		},
		{
			name: 'Digital Marketing Strategies',
			description:
				'Learn effective digital marketing techniques for business growth.',
			author_id: (
				await db
					.select()
					.from(schema.Users)
					.where(eq(schema.Users.email, 'monib619@gmail.com'))
			)[0].user_id,
			price: 89.99,
			image_url: 'https://picsum.photos/600?random=5',
			category_id: (
				await db
					.select()
					.from(schema.CoursesCategories)
					.where(eq(schema.CoursesCategories.name, 'Business'))
			)[0].category_id
		},
		{
			name: 'Machine Learning Basics',
			description:
				'Introduction to machine learning algorithms and applications.',
			author_id: (
				await db
					.select()
					.from(schema.Users)
					.where(eq(schema.Users.email, 'monib619@gmail.com'))
			)[0].user_id,
			price: 99.99,
			image_url: 'https://picsum.photos/600?random=6',
			category_id: (
				await db
					.select()
					.from(schema.CoursesCategories)
					.where(eq(schema.CoursesCategories.name, 'Data Science'))
			)[0].category_id
		},
		{
			name: 'Full Stack Web Development',
			description:
				'Learn to build complete web applications from front to back.',
			author_id: (
				await db
					.select()
					.from(schema.Users)
					.where(eq(schema.Users.email, 'monib619@gmail.com'))
			)[0].user_id,
			price: 129.99,
			image_url: 'https://picsum.photos/600?random=7',
			category_id: (
				await db
					.select()
					.from(schema.CoursesCategories)
					.where(eq(schema.CoursesCategories.name, 'Web Development'))
			)[0].category_id
		},
		{
			name: 'Mobile App Design',
			description: 'Create stunning mobile app interfaces for iOS and Android.',
			author_id: (
				await db
					.select()
					.from(schema.Users)
					.where(eq(schema.Users.email, 'monib619@gmail.com'))
			)[0].user_id,
			price: 74.99,
			image_url: 'https://picsum.photos/600?random=8',
			category_id: (
				await db
					.select()
					.from(schema.CoursesCategories)
					.where(eq(schema.CoursesCategories.name, 'Design'))
			)[0].category_id
		},
		{
			name: 'Cybersecurity Fundamentals',
			description: 'Learn essential cybersecurity concepts and best practices.',
			author_id: (
				await db
					.select()
					.from(schema.Users)
					.where(eq(schema.Users.email, 'monib619@gmail.com'))
			)[0].user_id,
			price: 84.99,
			image_url: 'https://picsum.photos/600?random=9',
			category_id: (
				await db
					.select()
					.from(schema.CoursesCategories)
					.where(eq(schema.CoursesCategories.name, 'Programming'))
			)[0].category_id
		},
		{
			name: 'Entrepreneurship 101',
			description: 'Start and grow your own business with proven strategies.',
			author_id: (
				await db
					.select()
					.from(schema.Users)
					.where(eq(schema.Users.email, 'monib619@gmail.com'))
			)[0].user_id,
			price: 69.99,
			image_url: 'https://picsum.photos/600?random=10',
			category_id: (
				await db
					.select()
					.from(schema.CoursesCategories)
					.where(eq(schema.CoursesCategories.name, 'Business'))
			)[0].category_id
		},
		{
			name: 'Artificial Intelligence Ethics',
			description:
				'Explore ethical considerations in AI development and deployment.',
			author_id: (
				await db
					.select()
					.from(schema.Users)
					.where(eq(schema.Users.email, 'monib619@gmail.com'))
			)[0].user_id,
			price: 79.99,
			image_url: 'https://picsum.photos/600?random=11',
			category_id: (
				await db
					.select()
					.from(schema.CoursesCategories)
					.where(eq(schema.CoursesCategories.name, 'Data Science'))
			)[0].category_id
		},
		{
			name: 'Responsive Web Design',
			description:
				'Create websites that look great on all devices and screen sizes.',
			author_id: (
				await db
					.select()
					.from(schema.Users)
					.where(eq(schema.Users.email, 'monib619@gmail.com'))
			)[0].user_id,
			price: 54.99,
			image_url: 'https://picsum.photos/600?random=12',
			category_id: (
				await db
					.select()
					.from(schema.CoursesCategories)
					.where(eq(schema.CoursesCategories.name, 'Web Development'))
			)[0].category_id
		}
	]);
}

async function createReviews() {
	const courses = await db.select().from(schema.Courses);
	const users = await db.select().from(schema.Users);

	for (const user of users) {
		for (const course of courses) {
			await db.insert(schema.CoursesReviews).values({
				course_id: course.course_id,
				user_id: user.user_id,
				rating: Math.floor(Math.random() * 5) || 1
			});
		}
	}
}

async function main() {
	await db.delete(schema.CoursesReviews).execute();
	await db.delete(schema.Courses).execute();
	await db.delete(schema.CoursesCategories).execute();

	await createCategories();
	await createCourses();
	await createReviews();
}

main();
