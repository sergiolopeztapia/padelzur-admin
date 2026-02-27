import type { ReactNode } from 'react';

export type PopupProps = Readonly<{
	isOpen: boolean;
	title?: string;
	onClose: () => void;
	children: ReactNode;
}>;
