import styles from '@/styles/dashboard.module.css';
import type { InputFieldProps } from './InputField.types';

export function InputField({
	type = 'text',
	placeholder,
	value,
	onChange,
	disabled = false,
	required = false,
	autoComplete,
	name,
	leftIcon,
	rightIcon,
}: InputFieldProps) {
	const hasIcons = leftIcon || rightIcon;

	if (!hasIcons) {
		return (
			<input
				className={styles['form-input']}
				type={type}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				disabled={disabled}
				required={required}
				autoComplete={autoComplete}
				name={name}
			/>
		);
	}

	return (
		<div
			style={{
				position: 'relative',
				display: 'flex',
				alignItems: 'center',
			}}>
			{leftIcon && (
				<div
					style={{
						position: 'absolute',
						left: '12px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						color: 'var(--muted)',
						pointerEvents: 'none',
						zIndex: 1,
					}}>
					{leftIcon}
				</div>
			)}
			<input
				className={styles['form-input']}
				type={type}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				disabled={disabled}
				required={required}
				autoComplete={autoComplete}
				name={name}
				style={{
					paddingLeft: leftIcon ? '40px' : undefined,
					paddingRight: rightIcon ? '40px' : undefined,
				}}
			/>
			{rightIcon && (
				<div
					style={{
						position: 'absolute',
						right: '12px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						color: 'var(--muted)',
						pointerEvents: 'none',
					}}>
					{rightIcon}
				</div>
			)}
		</div>
	);
}
