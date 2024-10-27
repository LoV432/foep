import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/db/db';
import { Media, Users } from '@/db/schema';
import { desc, eq, count } from 'drizzle-orm';
import Link from 'next/link';
import DeleteButton from './DeleteButton';
export default async function Component({
	searchParams
}: {
	searchParams: { page?: string };
}) {
	const session = await getSession();
	if (!session.success) {
		redirect('/login');
	}
	if (session.data.role !== 'admin' && session.data.role !== 'instructor') {
		redirect('/');
	}

	const page = parseInt(searchParams.page || '1', 10);
	const pageSize = 20;
	const offset = (page - 1) * pageSize;

	const mediaQuery = db
		.select({
			media_id: Media.media_id,
			friendly_name: Media.friendly_name,
			alt_text: Media.alt_text,
			url: Media.url,
			type: Media.type,
			created_at: Media.created_at,
			user_name: Users.name
		})
		.from(Media)
		.leftJoin(Users, eq(Media.user_id, Users.user_id))
		.where(
			session.data.role === 'admin'
				? undefined
				: eq(Media.user_id, session.data.id)
		)
		.orderBy(desc(Media.created_at))
		.limit(pageSize)
		.offset(offset);

	const totalCountQuery = db
		.select({ value: count() })
		.from(Media)
		.where(
			session.data.role === 'admin'
				? undefined
				: eq(Media.user_id, session.data.id)
		);

	const [mediaItems, [{ value: totalCount }]] = await Promise.all([
		mediaQuery,
		totalCountQuery
	]);

	const totalPages = Math.ceil(totalCount / pageSize);

	return (
		<div className="w-full bg-gray-200 p-4">
			<div className="container mx-auto mb-7 flex items-center justify-between">
				<h1 className="text-2xl font-bold">Media List</h1>
				<Button>
					<Link href="/admin/media-manager/upload">Upload Media</Link>
				</Button>
			</div>
			<div className="container mx-auto overflow-x-auto rounded-lg bg-white">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[100px]">Preview</TableHead>
							<TableHead>Name</TableHead>
							<TableHead className="hidden md:table-cell">Type</TableHead>
							<TableHead className="hidden md:table-cell">
								Uploaded By
							</TableHead>
							<TableHead className="hidden md:table-cell">
								Upload Date
							</TableHead>
							<TableHead className="w-[100px]">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{mediaItems.map((media) => (
							<TableRow key={media.media_id}>
								<TableCell>
									{media.type.startsWith('image/') ? (
										<Image
											src={media.url}
											alt={media.alt_text || media.friendly_name}
											width={50}
											height={50}
											className="h-16 w-16 rounded-md object-cover"
										/>
									) : (
										<div className="flex h-16 w-16 items-center justify-center rounded-md bg-gray-200 text-gray-500">
											{media.type.split('/')[0]}
										</div>
									)}
								</TableCell>
								<TableCell className="font-medium">
									{media.friendly_name}
								</TableCell>
								<TableCell className="hidden md:table-cell">
									{media.type}
								</TableCell>
								<TableCell className="hidden md:table-cell">
									{media.user_name}
								</TableCell>
								<TableCell className="hidden md:table-cell">
									{new Date(media.created_at).toLocaleDateString()}
								</TableCell>
								<TableCell>
									<DeleteButton
										mediaId={media.media_id}
										friendlyName={media.friendly_name}
									/>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			<div className="mt-4 flex items-center justify-center">
				<div className="flex space-x-4">
					<Button disabled={page === 1} className="w-20 p-0">
						<Link
							className="flex h-full w-full items-center justify-center"
							href={`?page=${page - 1}`}
						>
							Previous
						</Link>
					</Button>
					<div className="my-auto text-sm text-gray-700">
						Showing {offset + 1} to {Math.min(offset + pageSize, totalCount)} of{' '}
						{totalCount} media items
					</div>
					<Button disabled={page === totalPages} className="w-20 p-0">
						<Link
							className="flex h-full w-full items-center justify-center"
							href={`?page=${page + 1}`}
						>
							Next
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
