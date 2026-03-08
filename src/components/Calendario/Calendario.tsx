import styles from './Calendario.module.css';
import type { CalendarioProps } from './Calendario.types';

function Calendario({
	value,
	onChange,
	disabled = false,
	required = false,
	name,
	min,
	max,
}: CalendarioProps) {
	return (
		<input
			className={styles.formInput}
			type='date'
			value={value}
			onChange={onChange}
			disabled={disabled}
			required={required}
			name={name}
			min={min}
			max={max}
		/>
	);
}

export default Calendario;
