import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { InputField } from '@/components/InputField/InputField';
import { Button } from '@/components/Button/Button';
import { Logo } from '@/components/Logo/Logo';
import type { SupabaseSession } from '@/types/Session.types';
import useSessionStore from '@/stores/useSessionStore';
import styles from './LoginPage.module.css';
import type { LoginFormProps } from './LoginPage.types';
import toast from 'react-hot-toast';

function LoginForm({
	email,
	password,
	loading,
	error,
	onEmailChange,
	onPasswordChange,
	onSubmit,
	onAutofill,
}: LoginFormProps) {
	return (
		<form onSubmit={onSubmit}>
			<div className={styles.input}>
				<InputField
					type='email'
					placeholder='email@example.com'
					value={email}
					onChange={(e) => onEmailChange(e.target.value)}
					leftIcon={<Mail size={18} />}
				/>
			</div>

			<div className={styles.input}>
				<InputField
					type='password'
					placeholder='Contraseña'
					value={password}
					onChange={(e) => onPasswordChange(e.target.value)}
					leftIcon={<Lock size={18} />}
				/>
			</div>

			<div className={styles.actions}>
				<Button variant='primary' type='submit' disabled={loading}>
					{loading ? 'Entrando...' : 'Entrar'}
				</Button>
				<Button variant='secondary' iconName='Plus' onClick={onAutofill} />
			</div>
		</form>
	);
}

export function LoginPage() {
	const setSession = useSessionStore((state) => state.setSession);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleLogin: NonNullable<LoginFormProps['onSubmit']> = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const { data, error: authError } = await supabase.auth.signInWithPassword(
				{
					email,
					password,
				},
			);

			if (authError) throw authError;

			// The supabase client returns session object inside `data` (may contain session and user)
			const session = (data as { session?: unknown })?.session || data;

			if (session) {
				setSession(session as SupabaseSession);
			}
		} catch (err: unknown) {
			setError(
				(err instanceof Error ? err.message : String(err)) ||
					'Error al iniciar sesión',
			);
			toast.error('Error al iniciar sesión');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.login}>
				<Logo />
				<LoginForm
					email={email}
					password={password}
					loading={loading}
					error={error}
					onEmailChange={setEmail}
					onPasswordChange={setPassword}
					onSubmit={handleLogin}
					onAutofill={() => {
						setEmail('sergiolopeztapia@gmail.com');
						setPassword('123');
					}}
				/>
			</div>
		</div>
	);
}
