import type { SubmitEventHandler } from 'react';

export type LoginFormProps = Readonly<{
	onSubmit: SubmitEventHandler<HTMLFormElement>;
}>;

export type UseLoginFormResult = Readonly<{
	email: string;
	password: string;
	loading: boolean;
	error: string | null;
	onEmailChange: (value: string) => void;
	onPasswordChange: (value: string) => void;
	onSubmit: SubmitEventHandler<HTMLFormElement>;
	onAutofill: () => void;
}>;
