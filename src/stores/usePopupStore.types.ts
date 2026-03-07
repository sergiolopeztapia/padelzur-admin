import type { ReactNode } from 'react';

export type PopupConfig = {
	title?: string;
	children: ReactNode;
	onOpen?: () => void;
	onClose?: () => void;
};

export type PopupState = {
	isOpen: boolean;
	title?: string;
	children: ReactNode | null;
	onOpenCallback?: () => void;
	onCloseCallback?: () => void;
	openPopup: (config: PopupConfig) => void;
	closePopup: () => void;
};
