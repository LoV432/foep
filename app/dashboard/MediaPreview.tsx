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
		<VideoIcon className="h-24 w-24" />
	) : (
		<FileIcon className="h-24 w-24" />
	);
}
