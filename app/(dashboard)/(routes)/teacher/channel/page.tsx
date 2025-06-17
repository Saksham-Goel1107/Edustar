'use client';

import { MediaRoom } from '@/components/media-room';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

const TeacherChannelPage = () => {
	const { user } = useUser();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	// Use the same general room ID as students
	const roomId = 'general';

	return (
		<div className="h-[calc(100vh-80px)] bg-white dark:bg-slate-800">
			<MediaRoom chatId={roomId} video={true} audio={true} />
		</div>
	);
};

export default TeacherChannelPage;
