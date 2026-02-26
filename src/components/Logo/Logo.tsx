import styles from '@/styles/dashboard.module.css';
import pelotaImg from '@/assets/pelota.png';

interface LogoProps {
	size?: number;
}

export function Logo({ size = 50 }: LogoProps) {
	return (
		<h1 className={styles.logo} style={{ fontSize: '3rem' }}>
			<img
				src={pelotaImg}
				alt='PadelZur Logo'
				style={{
					width: `${size}px`,
					height: `${size}px`,
					mixBlendMode: 'multiply',
					filter: 'contrast(1.1)',
				}}
			/>
			PadelZur
		</h1>
	);
}
