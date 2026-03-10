import type { ChangeEvent } from 'react';

export type CalendarioProps = Readonly<{
	value: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	type?: 'date' | 'datetime-local';
	disabled?: boolean;
	required?: boolean;
	name?: string;
	min?: string;
	max?: string;
	step?: number;
}>;
