import { supabase } from '@/lib/supabase';
import useSessionStore from '@/stores/useSessionStore';
import type { SupabaseSession } from '@/types/Session.types';
import { useState } from 'react';
import toast from 'react-hot-toast';
import type { UseLoginFormResult } from '../LoginForm.types';

export default function useLoginForm(): UseLoginFormResult {
	const [email, setEmail] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [password, setPassword] = useState('');

	const setSession = useSessionStore((state) => state.setSession);

	const handleLogin: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
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

			const session = (data as { session?: unknown })?.session || data;

			if (session) {
				setSession(session as SupabaseSession);
			}
		} catch (err: unknown) {
			const message =
				(err instanceof Error ? err.message : String(err)) ||
				'Error al iniciar sesión';

			setError(message);
			toast.error(message);
		} finally {
			setLoading(false);
		}
	};

	const handleAutofill = () => {
		setEmail('sergiolopeztapia@gmail.com');
		setPassword('123');
	};

	return {
		email,
		password,
		loading,
		error,
		onEmailChange: setEmail,
		onPasswordChange: setPassword,
		onSubmit: handleLogin,
		onAutofill: handleAutofill,
	};
}
