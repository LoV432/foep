'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Media } from '@/db/schema';
import { useState } from 'react';
import MediaPreview from './MediaPreview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
			<DialogContent className="grid h-[90vh] max-w-screen-xl grid-rows-[auto_1fr]">
				<Tabs defaultValue="media">
					<TabsList className="mb-4 w-56">
						<TabsTrigger className="w-full" value="media">
							Media
						</TabsTrigger>
						<TabsTrigger className="w-full" value="upload">
							Upload
						</TabsTrigger>
					</TabsList>
					<TabsContent value="media">
						<DialogHeader className="mb-4 h-fit w-fit">
							<DialogTitle className="text-2xl font-bold">My Media</DialogTitle>
						</DialogHeader>
						<div className="relative grid-cols-[3fr_1fr] md:grid">
							<div className="flex h-fit w-fit flex-wrap gap-4">
								{userMedia.map((media) => (
									<Card
										key={media.media_id}
										className={`h-32 w-32 ${
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
								<div className="absolute right-0 top-0 flex h-full w-full flex-col gap-4 border-l-2 border-border bg-background md:relative">
									<h2 className="mx-auto w-[90%] text-xl font-bold">Details</h2>
									<div className="mx-auto flex h-full w-[90%] flex-col gap-4">
										<div className="h-32 w-32">
											<Card className="h-32 w-32">
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
						</div>
					</TabsContent>
					<TabsContent value="upload">Upload files</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
