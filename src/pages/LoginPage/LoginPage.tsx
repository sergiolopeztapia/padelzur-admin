import { Logo } from '@/components/Logo/Logo';
import LoginForm from '@/features/LoginForm/LoginForm';
import styles from './LoginPage.module.css';

export function LoginPage() {
	return (
		<div className={styles.container}>
			<div className={styles.login}>
				<Logo />
				<LoginForm />
			</div>
		</div>
	);
}
