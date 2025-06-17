'use client';

import { useEffect, useState } from 'react';
import { LiveKitRoom, VideoConference } from '@livekit/components-react';
import '@livekit/components-styles';
import { useUser } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';

interface MediaRoomProps {
	chatId: string;
	video: boolean;
	audio: boolean;
}

export const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
	const { user } = useUser();
	const [token, setToken] = useState('');

	useEffect(() => {
		if (!user?.firstName && !user?.lastName) return;

		// Import isTeacher function inline to avoid circular dependencies
		const isTeacher = (userId?: string | null) => {
			return userId === process.env.NEXT_PUBLIC_TEACHER_ID;
		};

		// Add teacher label to name if user is a teacher
		let name = `${user?.firstName ? user.firstName.trim() : ''} ${
			user?.lastName ? user.lastName.trim() : ''
		}`.trim();
		
		// Add teacher label if the user is a teacher
		if (isTeacher(user?.id)) {
			name = `${name} (Teacher)`;
		}

		(async () => {
			try {
				const resp = await fetch(
					`/api/livekit?room=${chatId}&username=${name}`
				);
				const data = await resp.json();
				setToken(data.token);
			} catch (e) {
				console.log(e);
			}
		})();
	}, [user?.firstName, user?.lastName, user?.id, chatId]);

	if (token === '') {
		return (
			<div className="flex flex-col flex-1 justify-center items-center">
				<Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
				<p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
			</div>
		);
	}

	return (
		<LiveKitRoom
			data-lk-theme="default"
			serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
			token={token}
			connect={true}
			video={video}
			audio={audio}
		>
			<VideoConference />
		</LiveKitRoom>
	);
};
