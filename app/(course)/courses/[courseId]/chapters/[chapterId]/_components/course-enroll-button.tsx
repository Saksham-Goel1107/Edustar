'use client';

import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface CourseEnrollButtonProps {
	courseId: string;
	price: number;
}

const CourseEnrollButton = ({ courseId, price }: CourseEnrollButtonProps) => {
	const [isLoading, setIsLoading] = useState(false);
	const [showDirect, setShowDirect] = useState(false);

	const onClick = async () => {
		try {
			setIsLoading(true);
			toast.loading('Preparing checkout...');

			const response = await axios.post(`/api/courses/${courseId}/checkout`);

			if (response.status === 200 && response.data.url) {
				window.location.assign(response.data.url);
			} else {
				toast.dismiss();
				toast.error('Failed to initialize checkout process');
				setShowDirect(true); 
			}
		} catch (error: any) {
			toast.dismiss();
			if (error.response?.data === 'Already purchased') {
				toast.error('You have already purchased this course');
				window.location.reload();
			} else {
				toast.error('Something went wrong with the checkout process');
				console.error('Checkout error:', error);
				setShowDirect(true);
			}
		} finally {
			setIsLoading(false);
		}
	};
	
	const handleDirectPurchase = async () => {
		try {
			setIsLoading(true);
			toast.loading('Processing purchase...');
			
			const response = await axios.post(`/api/courses/${courseId}/purchase`);
			
			toast.dismiss();
			if (response.data.success) {
				toast.success('Course purchased successfully!');
				setTimeout(() => {
					window.location.reload();
				}, 1500);
			} else {
				toast.error('Failed to purchase course.');
			}
		} catch (error: any) {
			toast.dismiss();
			if (error.response?.data === 'Already purchased') {
				toast.error('You have already purchased this course');
				setTimeout(() => window.location.reload(), 1500);
			} else {
				toast.error('Error completing purchase');
				console.error('Direct purchase error:', error);
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex flex-col md:flex-row gap-2">
			<Button
				onClick={onClick}
				disabled={isLoading}
				size={'sm'}
				className="w-full md:w-auto"
			>
				Enroll for {formatPrice(price)}
			</Button>
			
			{showDirect && (
				<Button
					onClick={handleDirectPurchase}
					disabled={isLoading}
					size={'sm'}
					variant="outline"
					className="w-full md:w-auto"
				>
					Direct Purchase
				</Button>
			)}
		</div>
	);
};

export default CourseEnrollButton;
