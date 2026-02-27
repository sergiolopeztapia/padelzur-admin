import type { ChangeEvent, ReactNode } from 'react';

export type InputFieldProps = Readonly<{
	type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
	placeholder?: string;
	value: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	disabled?: boolean;
	required?: boolean;
	autoComplete?: string;
	name?: string;
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
}>;
