'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { useTheme } from 'next-themes';

import 'react-quill/dist/quill.snow.css';

interface EditorProps {
	value: string;
	onChange: (value: string) => void;
}

export const Editor = ({ value, onChange }: EditorProps) => {
	const { resolvedTheme } = useTheme();
	const isDarkMode = resolvedTheme === 'dark';
	
	const ReactQuill = useMemo(
		() => dynamic(() => import('react-quill'), { ssr: false }),
		[]
	);

	return (
		<div className={`${isDarkMode ? 'bg-slate-800 quill-dark' : 'bg-white'}`}>
			<ReactQuill 
				theme="snow" 
				value={value} 
				onChange={onChange}
				className={isDarkMode ? 'dark-editor' : ''}
			/>
		</div>
	);
};
