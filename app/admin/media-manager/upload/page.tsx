'use client';

import { Button } from '@/components/ui/button';
import UploadForm from '@/components/UploadDialog/UploadForm';
import Link from 'next/link';
import { revalidatePathAction } from '@/lib/revalidate-path';

export default function UploadPage() {
	return (
		<div className="w-full bg-gray-200 p-4">
			<div className="container w-full">
				<Button className="p-0">
					<Link
						className="flex h-full w-full items-center justify-center p-4"
						href="/admin/media-manager"
					>
						Back to Media List
					</Link>
				</Button>
			</div>
			<div className="container mx-auto w-fit rounded-lg bg-white p-12">
				<UploadForm
					refetchMedia={() => revalidatePathAction('/admin/media-manager')}
				/>
			</div>
		</div>
	);
}
