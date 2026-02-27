import type { SupabaseSession } from '@/types/Session.types';

export type SessionState = Readonly<{
	session: SupabaseSession | null;
	setSession: (session: SupabaseSession | null) => void;
	clearSession: () => void;
}>;
