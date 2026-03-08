import type { ChangeEvent } from 'react';

export type CalendarioProps = Readonly<{
	value: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	disabled?: boolean;
	required?: boolean;
	name?: string;
	min?: string;
	max?: string;
}>;
