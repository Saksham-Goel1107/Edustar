'use client';

import ConfirmModal from '@/components/modals/confirm-modal';
import { Button } from '@/components/ui/button';
import { useConfettiStore } from '@/hooks/use-confetti-store';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface ActionsProps {
	disabled: boolean;
	courseId: string;
	isPublished: boolean;
}

const Actions = ({ disabled, courseId, isPublished }: ActionsProps) => {
	const router = useRouter();
	const confetti = useConfettiStore();
	const [isLoading, setIsLoading] = useState(false);

	const onClick = async () => {
		try {
			setIsLoading(true);

			if (isPublished) {
				await axios.patch(`/api/courses/${courseId}/unpublish`);

				toast.success('Course unpublished');
			} else {
				await axios.patch(`/api/courses/${courseId}/publish`);

				toast.success('Course published');

				confetti.onOpen();
			}

			router.refresh();
		} catch (error) {
			if (axios.isAxiosError(error) && error.response?.data) {
				const errorMessage = error.response.data;
				
				if (errorMessage.includes('published chapter')) {
					toast.error('You need to publish at least one chapter before publishing the course');
				} else if (errorMessage.includes('Missing required fields')) {
					toast.error(errorMessage);
				} else {
					toast.error('Unable to publish course: ' + errorMessage);
				}
			} else {
				toast.error('Something went wrong');
			}
		} finally {
			setIsLoading(false);
		}
	};

	const onDelete = async () => {
		try {
			setIsLoading(true);

			await axios.delete(`/api/courses/${courseId}`);

			toast.success('Course deleted');

			router.refresh();
			router.push(`/teacher/courses`);
		} catch {
			toast.error('Something went wrong');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex items-center gap-x-2">
			<Button
				onClick={onClick}
				disabled={disabled || isLoading}
				variant={'outline'}
				size={'sm'}
			>
				{isPublished ? 'Unpublish' : 'Publish'}
			</Button>

			<ConfirmModal onConfirm={onDelete}>
				<Button size={'sm'} disabled={isLoading}>
					<Trash className="w-4 h-4" />
				</Button>
			</ConfirmModal>
		</div>
	);
};

export default Actions;
