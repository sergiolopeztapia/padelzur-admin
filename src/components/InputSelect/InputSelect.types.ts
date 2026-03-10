import type { ChangeEvent } from 'react';

export type InputSelectOption = Readonly<{
	value: string | number;
	label: string;
	disabled?: boolean;
}>;

export type InputSelectProps = Readonly<{
	options: InputSelectOption[];
	value: string | number | '';
	onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
	placeholder?: string;
	disabled?: boolean;
	required?: boolean;
	name?: string;
	className?: string;
}>;
