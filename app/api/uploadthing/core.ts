import { isTeacher } from '@/lib/teacher';
import { auth } from '@clerk/nextjs';
import { createUploadthing, type FileRouter } from 'uploadthing/next';

const f = createUploadthing();

const handleAuth = () => {
	const { userId } = auth();

	const isAuthrizied = isTeacher(userId);

	if (!userId || !isAuthrizied) throw new Error('Unauthorized');
	return { userId };
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
	courseImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
		.middleware(() => handleAuth())
		.onUploadComplete(() => {}),
	courseAttachment: f(['text', 'image', 'video', 'audio', 'pdf'])
		.middleware(() => handleAuth())
		.onUploadComplete(() => {}),
	chapterVideo: f({ video: { maxFileSize: '1GB', maxFileCount: 1 } })
		.middleware(() => handleAuth())
		.onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
