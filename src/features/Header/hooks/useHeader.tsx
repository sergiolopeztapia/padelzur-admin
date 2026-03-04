import { supabase } from '@/lib/supabase';
import useSessionStore from '@/stores/useSessionStore';
import type { UseHeaderResult } from '../Header.types';

export default function useHeader(): UseHeaderResult {
	const clearSession = useSessionStore((state) => state.clearSession);

	const handleLogout = async () => {
		try {
			await supabase.auth.signOut();
			clearSession();
			sessionStorage.removeItem('supabase_session');
			window.location.href = '/login';
		} catch (error) {
			console.error('Error al cerrar sesión:', error);
		}
	};

	return {
		onLogout: handleLogout,
	};
}
