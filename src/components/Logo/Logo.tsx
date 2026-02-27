import pelotaImg from '@/assets/pelota.png';
import type { LogoProps } from './Logo.types';
import styles from './Logo.module.css';

export function Logo({ size = 50 }: LogoProps) {
	return (
		<h1 className={styles.logo} style={{ fontSize: '3rem' }}>
			<img
				src={pelotaImg}
				alt='PadelZur Logo'
				style={{
					width: `${size}px`,
					height: `${size}px`,
				}}
			/>
			PadelZur
		</h1>
	);
}
