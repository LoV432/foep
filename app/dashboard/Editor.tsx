'use client';

import MDEditor, { commands, getCommands } from '@uiw/react-md-editor';
import { ImageIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import UploadDialog from './UploadDialog';
import { Media } from '@/db/schema';

export default function App({
	userMedia
}: {
	userMedia: (typeof Media.$inferSelect)[];
}) {
	const [value, setValue] = useState<string | undefined>('**Hello world!!!**');
	useEffect(() => {
		console.log(value);
	}, [value]);

	return (
		<div className="container">
			<MDEditor
				value={value}
				onChange={setValue}
				//autoCapitalize="none"
				// There seems to be a bug with autoCapitalize on firefox.
				// firefox throws this error:
				// Warning: Prop `autoCapitalize` did not match. Server: "none" Client: "off"
				// https://bugzilla.mozilla.org/show_bug.cgi?id=1906555
				commands={[
					...getCommands().filter((command) => command.name !== 'image'),
					commands.group([], {
						name: 'media',
						groupName: 'media',
						icon: <ImageIcon />,
						children: (handle) => {
							function handleSelectedMedia(media: typeof Media.$inferSelect) {
								if (media.type.startsWith('image/')) {
									handle.textApi?.replaceSelection(
										`<img src="${media.url}" alt="${media.alt_text ?? media.friendly_name}" width="50%" />`
									);
								} else if (media.type.startsWith('video/')) {
									handle.textApi?.replaceSelection(
										`<video src="${media.url}" controls></video>`
									);
								} else {
									handle.textApi?.replaceSelection(
										`[${media.friendly_name}](${media.url})`
									);
								}
								handle.close();
							}
							return (
								<UploadDialog
									userMedia={userMedia}
									selectedMediaCallback={handleSelectedMedia}
								/>
							);
						},
						buttonProps: { 'aria-label': 'Insert title' }
					})
				]}
			/>
		</div>
	);
}
