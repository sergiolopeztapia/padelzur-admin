import type { ComponentProps } from 'react';

export type LoginFormProps = Readonly<{
	email: string;
	password: string;
	loading: boolean;
	error: string | null;
	onEmailChange: (value: string) => void;
	onPasswordChange: (value: string) => void;
	onSubmit: ComponentProps<'form'>['onSubmit'];
	onAutofill: () => void;
}>;
