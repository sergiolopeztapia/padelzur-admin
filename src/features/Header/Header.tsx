import Button from '@/components/Button/Button';
import Logo from '@/components/Logo/Logo';
import styles from './Header.module.css';
import useHeader from './hooks/useHeader';
import type { HeaderProps } from './Header.types';

function Header({ activeSection, onSectionChange }: HeaderProps) {
	const { onLogout } = useHeader();

	return (
		<header className={styles.container}>
			<div className={styles.headerLeft}>
				<Logo />
			</div>
			<div className={styles.actions}>
				<div className={styles.sectionSwitcher}>
					<Button
						className={styles.navButton}
						variant={activeSection === 'clubs' ? 'primary' : 'secondary'}
						onClick={() => onSectionChange('clubs')}>
						Clubes
					</Button>
					<Button
						className={styles.navButton}
						variant={activeSection === 'jugadores' ? 'primary' : 'secondary'}
						onClick={() => onSectionChange('jugadores')}>
						Jugadores
					</Button>
					<Button
						className={styles.navButton}
						variant={activeSection === 'pistas' ? 'primary' : 'secondary'}
						onClick={() => onSectionChange('pistas')}>
						Pistas
					</Button>
				</div>
				<Button
					className={styles.logoutButton}
					variant='logout'
					onClick={onLogout}
					title='Cerrar sesión'>
					Cerrar sesión
				</Button>
			</div>
		</header>
	);
}

export default Header;
