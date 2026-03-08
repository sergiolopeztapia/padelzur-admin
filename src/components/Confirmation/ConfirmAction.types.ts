import type { ReactNode } from 'react';

export type ConfirmActionProps = Readonly<{
	message: ReactNode;
	onConfirm: () => Promise<void> | void;
	onCancel: () => void;
	confirmText?: string;
	cancelText?: string;
}>;
