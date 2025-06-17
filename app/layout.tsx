import { ClerkProvider, auth } from '@clerk/nextjs';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ToastProvider } from '@/components/providers/toast-provider';
import ConfettiProvider from '@/components/providers/confetti-provider';
import { ThemeProvider } from '@/components/theme-provider';
import FacebookMessenger from '@/components/facebook-messenger';
import { isTeacher } from '@/lib/teacher';
import Providers from './Provider'

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'EduStar | Advanced Learning Management System',
	description: 'Transform your educational journey with EduStar LMS - The premier platform for interactive courses, expert instruction, and personalized learning experiences.',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { userId } = auth();

	return (
		<ClerkProvider>
			<html lang="en">
				<body className={inter.className}>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<ConfettiProvider />

						<ToastProvider />

						{userId ? (
							<Providers>{children}</Providers>
						) : (
							<>{children}</>
						)}
					</ThemeProvider>
				</body>

				{!isTeacher(userId) && <FacebookMessenger />}
			</html>
		</ClerkProvider>
	);
}
