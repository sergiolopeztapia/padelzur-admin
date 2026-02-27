import type { ButtonHTMLAttributes, ReactNode } from 'react';
import * as LucideIcons from 'lucide-react';

export type ButtonVariant =
	| 'primary'
	| 'secondary'
	| 'success'
	| 'danger'
	| 'edit'
	| 'logout';
export type ButtonSize = 'default' | 'sm';
export type IconPosition = 'left' | 'right';

export type ButtonProps = Readonly<{
	variant?: ButtonVariant;
	size?: ButtonSize;
	children?: ReactNode;
	fullWidth?: boolean;
	iconName?: keyof typeof LucideIcons;
	iconPosition?: IconPosition;
	iconSize?: number;
}> &
	ButtonHTMLAttributes<HTMLButtonElement>;
