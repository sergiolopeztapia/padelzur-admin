import styles from './InputSelect.module.css';
import type { InputSelectProps } from './InputSelect.types';

function InputSelect({
	options,
	value,
	onChange,
	placeholder,
	disabled = false,
	required = false,
	name,
	className = '',
}: InputSelectProps) {
	const classes = [styles.formSelect, className].filter(Boolean).join(' ');

	return (
		<div className={styles.selectWrapper}>
			<select
				className={classes}
				value={value}
				onChange={onChange}
				disabled={disabled}
				required={required}
				name={name}>
				{placeholder && (
					<option value='' disabled={required}>
						{placeholder}
					</option>
				)}
				{options.map((option) => (
					<option
						key={`${option.value}-${option.label}`}
						value={option.value}
						disabled={option.disabled}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	);
}

export default InputSelect;
