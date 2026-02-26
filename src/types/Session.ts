export interface SupabaseSession {
	access_token: string;
	expires_at?: number;
	refresh_token?: string;
	provider_token?: string;
	user: {
		id: string;
		email?: string | null;
		app_metadata?: Record<string, unknown>;
		user_metadata?: Record<string, unknown>;
	};
}
