import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle';
import { InputField } from '@/components/InputField/InputField';
import { Button } from '@/components/Button/Button';
import { Logo } from '@/components/Logo/Logo';
import styles from '@/styles/dashboard.module.css';
import type { SupabaseSession } from '@/types/Session';

interface LoginFormProps {
	email: string;
	password: string;
	loading: boolean;
	error: string | null;
	onEmailChange: (value: string) => void;
	onPasswordChange: (value: string) => void;
	onSubmit: (e: React.FormEvent) => void;
	onAutofill: () => void;
}

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
		<form onSubmit={onSubmit} style={{ marginTop: 24 }}>
			<div style={{ marginBottom: 16 }}>
				<InputField
					type='email'
					placeholder='email@example.com'
					value={email}
					onChange={(e) => onEmailChange(e.target.value)}
					leftIcon={<Mail size={18} />}
				/>
			</div>

			<div style={{ marginBottom: 18 }}>
				<InputField
					type='password'
					placeholder='Contraseña'
					value={password}
					onChange={(e) => onPasswordChange(e.target.value)}
					leftIcon={<Lock size={18} />}
				/>
			</div>

			<div className={styles['form-actions']}>
				<Button variant='primary' type='submit' disabled={loading}>
					{loading ? 'Entrando...' : 'Entrar'}
				</Button>
				<Button variant='secondary' iconName='Plus' onClick={onAutofill} />
			</div>

			{error && (
				<div
					style={{
						color: '#ffb4b4',
						marginTop: 16,
						padding: '12px 14px',
						borderRadius: '8px',
						background: 'rgba(255, 180, 180, 0.1)',
						fontSize: '0.9rem',
					}}>
					{error}
				</div>
			)}
		</form>
	);
}

export function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleLogin = async (e: React.FormEvent) => {
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
			const session =
				(data as unknown as { session?: unknown } | unknown)?.session || data;

			if (session) {
				const saved: SupabaseSession = {
					access_token: session.access_token,
					expires_at: session.expires_at,
					refresh_token: session.refresh_token,
					provider_token: session.provider_token,
					user: session.user,
				};

				sessionStorage.setItem('supabase_session', JSON.stringify(saved));
				// reload to pick up changes or redirect
				window.location.href = '/';
			}
		} catch (err: unknown) {
			setError(
				(err instanceof Error ? err.message : String(err)) ||
					'Error al iniciar sesión',
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			className={styles['dashboard-container']}
			style={{
				background:
					'linear-gradient(135deg, #C8E600 0%, #7FBA00 50%, #006633 100%)',
				backgroundSize: '400% 400%',
				animation: 'gradientShift 15s ease infinite',
			}}>
			<style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
			<div style={{ position: 'fixed', top: 20, right: 20, zIndex: 1000 }}>
				<ThemeToggle />
			</div>
			<div
				style={{
					width: '100%',
					minHeight: '100vh',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					padding: '24px',
				}}>
				<div
					className={styles.card}
					style={{
						maxWidth: 250,
						boxShadow: '0 8px 32px rgba(0, 102, 51, 0.3)',
					}}>
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
		</div>
	);
}
