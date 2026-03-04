import { Button } from '@/components/Button/Button';
import { Logo } from '@/components/Logo/Logo';
import styles from './Header.module.css';
import useHeader from './hooks/useHeader';

function Header() {
	const { onLogout } = useHeader();

	return (
		<header className={styles.container}>
			<div className={styles.headerLeft}>
				<Logo />
			</div>
			<Button variant='logout' onClick={onLogout} title='Cerrar sesión'>
				Cerrar sesión
			</Button>
		</header>
	);
}

export default Header;
