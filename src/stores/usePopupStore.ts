import { create } from 'zustand';
import type { PopupState } from './usePopupStore.types';

const usePopupStore = create<PopupState>((set, get) => ({
	isOpen: false,
	title: undefined,
	children: null,
	onOpenCallback: undefined,
	onCloseCallback: undefined,
	openPopup: (config) => {
		set({
			isOpen: true,
			title: config.title,
			children: config.children,
			onOpenCallback: config.onOpen,
			onCloseCallback: config.onClose,
		});
		config.onOpen?.();
	},
	closePopup: () => {
		const { onCloseCallback } = get();
		onCloseCallback?.();
		set({
			isOpen: false,
			title: undefined,
			children: null,
			onOpenCallback: undefined,
			onCloseCallback: undefined,
		});
	},
}));

export default usePopupStore;
