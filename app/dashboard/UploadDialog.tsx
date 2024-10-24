'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Media } from '@/db/schema';
import { useState } from 'react';
import MediaPreview from './MediaPreview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UploadForm from './UploadForm';

export default function UploadDialog({
	userMedia
}: {
	userMedia: (typeof Media.$inferSelect)[];
}) {
	const [selectedMedia, setSelectedMedia] =
		useState<(typeof userMedia)[number]>();
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>Media Library</Button>
			</DialogTrigger>
			<DialogContent className="max-w-screen-xl">
				<Tabs defaultValue="media" className="relative h-[90vh]">
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
						className="grid h-[calc(100%-5rem)] grid-cols-1 md:grid-cols-[3fr_1fr]"
					>
						<div
							id="media-list"
							className="flex flex-wrap justify-center gap-4 overflow-scroll md:justify-start"
						>
							{userMedia.map((media) => (
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
										<MediaPreview media={media} width={128} height={128} />
									</CardContent>
								</Card>
							))}
						</div>
						{selectedMedia && (
							<div className="absolute right-0 top-0 flex h-full w-full flex-col gap-4 border-border bg-background p-4 md:relative md:border-l-2">
								<h2 className="text-lg font-bold sm:text-xl">Details</h2>
								<div className="flex flex-col gap-4">
									<div className="mx-auto h-24 w-24 sm:h-32 sm:w-32 md:mx-0">
										<Card className="h-full w-full">
											<CardContent className="flex h-full w-full items-center justify-center p-0">
												<MediaPreview
													media={selectedMedia}
													width={128}
													height={128}
												/>
											</CardContent>
										</Card>
									</div>
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
										<Button>Select</Button>
									</div>
								</div>
							</div>
						)}
					</TabsContent>
					<TabsContent value="upload">
						<UploadForm />
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
