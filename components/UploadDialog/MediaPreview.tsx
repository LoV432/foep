import { Media } from '@/db/schema';
import Image from 'next/image';
import { FileIcon, VideoIcon } from 'lucide-react';

export default function MediaPreview({
	media,
	width,
	height
}: {
	media: typeof Media.$inferSelect;
	width: number;
	height: number;
}) {
	return media.type.split('/')[0] === 'image' ? (
		<Image
			src={media.url}
			className="object-cover"
			alt={media.type}
			width={width}
			height={height}
		/>
	) : media.type.split('/')[0] === 'video' ? (
		<div className="flex w-full flex-col items-center">
			<VideoIcon className="h-12 w-12 sm:h-24 sm:w-24" />
			<p className="mx-auto w-full overflow-hidden text-ellipsis whitespace-nowrap px-3 text-sm">
				{media.friendly_name}
			</p>
		</div>
	) : (
		<div className="flex w-full flex-col items-center">
			<FileIcon className="h-12 w-12 sm:h-24 sm:w-24" />
			<p className="mx-auto w-full overflow-hidden text-ellipsis whitespace-nowrap px-3 text-sm">
				{media.friendly_name}
			</p>
		</div>
	);
}
