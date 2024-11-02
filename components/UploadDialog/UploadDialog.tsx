'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Media } from '@/db/schema';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import MediaPreview from './MediaPreview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UploadForm from './UploadForm';
import { ScrollArea } from '@/components/ui/scroll-area';
import DeleteMedia from './DeleteMedia';
import { Spinner } from '@/components/ui/spinner';

async function fetchUserMedia() {
	const response = await fetch('/api/media');
	if (!response.ok) {
		throw new Error('Failed to fetch media');
	}
	return (await response.json()).message as (typeof Media.$inferSelect)[];
}

export default function UploadDialog({
	selectedMediaCallback,
	defaultTab,
	className,
	placeholder
}: {
	selectedMediaCallback?: (media: typeof Media.$inferSelect) => void;
	defaultTab?: 'media' | 'upload';
	className?: string;
	placeholder?: string;
}) {
	const [open, setOpen] = useState(false);
	const [selectedMedia, setSelectedMedia] =
		useState<typeof Media.$inferSelect>();

	const {
		data: userMedia,
		isLoading,
		error,
		refetch
	} = useQuery({
		queryKey: ['userMedia'],
		queryFn: fetchUserMedia
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className={className}>
					{placeholder ??
						(defaultTab === 'upload' ? 'Upload' : 'Media Library')}
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-screen-xl">
				<DialogTitle hidden>Upload Manager</DialogTitle>
				<DialogDescription hidden>
					A list of all your uploaded media with options to delete or upload
					them.
				</DialogDescription>
				<Tabs
					defaultValue={defaultTab ?? 'media'}
					className="relative h-[90dvh] overflow-y-auto"
				>
					<TabsList className="mb-4 mt-4 w-full sm:w-56">
						<TabsTrigger className="w-full" value="media">
							Media
						</TabsTrigger>
						<TabsTrigger className="w-full" value="upload">
							Upload
						</TabsTrigger>
					</TabsList>
					<TabsContent
						value="media"
						// TODO: I dont like the use of calc here.
						// There must be a way to make the media list take up the full height of the dialog.
						className="h-[calc(100%-5rem)]"
					>
						<div className="grid h-full md:grid-cols-[3fr_1fr]">
							<ScrollArea className="h-full w-full">
								<div
									id="media-list"
									className="flex flex-wrap justify-center gap-4 self-baseline md:justify-start"
								>
									{isLoading && (
										<div className="absolute inset-0 flex h-full w-full items-center justify-center">
											<Spinner className="h-8 w-8 text-primary" />
											<span className="ml-2 text-lg">Loading media...</span>
										</div>
									)}
									{error && (
										<div className="flex h-full w-full items-center justify-center text-red-500">
											Error loading media: {error.message}
										</div>
									)}
									{userMedia &&
										userMedia.map((media) => (
											<Card
												key={media.media_id}
												className={`h-24 w-24 overflow-hidden sm:h-32 sm:w-32 ${
													selectedMedia?.media_id === media.media_id
														? 'border-2 border-primary'
														: ''
												}`}
												onClick={() => setSelectedMedia(media)}
											>
												<CardContent className="flex h-full w-full items-center justify-center p-0">
													<MediaPreview
														media={media}
														width={128}
														height={128}
													/>
												</CardContent>
											</Card>
										))}
								</div>
							</ScrollArea>
							{selectedMedia && (
								<div className="absolute right-0 top-0 flex h-full w-full flex-col gap-4 border-border bg-background p-4 md:relative md:border-l-2">
									<h2 className="text-lg font-bold sm:text-xl">Details</h2>
									<div className="flex flex-col gap-4">
										<Card className="h-32 w-32 overflow-hidden">
											<CardContent className="flex h-full w-full items-center justify-center p-0">
												<MediaPreview
													media={selectedMedia}
													width={128}
													height={128}
												/>
											</CardContent>
										</Card>
										<div className="flex flex-col gap-2">
											<p className="text-sm font-bold">Name</p>
											<p className="text-wrap text-sm">
												{selectedMedia.friendly_name}
											</p>
										</div>
										<div className="flex flex-col gap-2">
											<p className="text-sm font-bold">Alt Text</p>
											<p className="text-sm">{selectedMedia.alt_text}</p>
										</div>
										<div className="flex flex-col gap-2">
											<p className="text-sm font-bold">Type</p>
											<p className="text-sm">{selectedMedia.type}</p>
										</div>
										<div className="flex flex-col gap-2">
											<p className="text-sm font-bold">Uploaded At</p>
											<p className="text-sm">
												{selectedMedia.created_at.toLocaleString()}
											</p>
										</div>
										<div className="flex gap-2">
											<Button
												onClick={() => setSelectedMedia(undefined)}
												variant="outline"
											>
												Cancel
											</Button>
											{selectedMediaCallback && (
												<Button
													onClick={() => {
														selectedMediaCallback(selectedMedia);
														setOpen(false);
													}}
												>
													Select
												</Button>
											)}
											<DeleteMedia
												mediaId={selectedMedia.media_id}
												refetchMedia={refetch}
											/>
										</div>
									</div>
								</div>
							)}
						</div>
					</TabsContent>
					<TabsContent value="upload">
						<UploadForm
							selectedMediaCallback={selectedMediaCallback}
							closeDialog={
								selectedMediaCallback ? () => setOpen(false) : undefined
							}
							refetchMedia={refetch}
						/>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
