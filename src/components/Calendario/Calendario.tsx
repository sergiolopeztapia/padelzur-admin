import styles from './Calendario.module.css';
import type { CalendarioProps } from './Calendario.types';

function Calendario({
	value,
	onChange,
	type = 'date',
	disabled = false,
	required = false,
	name,
	min,
	max,
	step,
}: CalendarioProps) {
	return (
		<input
			className={styles.formInput}
			type={type}
			value={value}
			onChange={onChange}
			disabled={disabled}
			required={required}
			name={name}
			min={min}
			max={max}
			step={step}
		/>
	);
}

export default Calendario;
