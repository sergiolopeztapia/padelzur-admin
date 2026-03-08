import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { SupabaseSession } from '@/types/Session.types';
import type {
	UseSupabaseOptions,
	UseSupabaseResult,
} from './useSupabase.types';

/**
 * Custom React hook for interacting with Supabase
 * Provides methods to fetch, insert, update, and delete records
 *
 * @example
 * const { data, loading, error, fetchData } = useSupabase<User>({ table: 'users' })
 *
 * useEffect(() => {
 *   fetchData()
 * }, [fetchData])
 */
export function useSupabase<T>({
	table,
}: UseSupabaseOptions): UseSupabaseResult<T> {
	const [data, setData] = useState<T[] | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const [loading, setLoading] = useState(false);

	// Fetch data from the specified table
	const fetchData = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const { data: result, error: fetchError } = await supabase
				.from(table)
				.select('*');

			if (fetchError) throw new Error(fetchError.message);
			setData(result);
		} catch (err) {
			setError(err instanceof Error ? err : new Error('Unknown error'));
		} finally {
			setLoading(false);
		}
	}, [table]);

	// If there's a saved session in sessionStorage, restore it into the Supabase client
	useEffect(() => {
		try {
			const raw = sessionStorage.getItem('supabase_session');
			if (!raw) return;
			const parsed: SupabaseSession = JSON.parse(raw);

			// set session in supabase client so requests include the token
			// supabase-js v2 exposes auth.setSession
			if (parsed?.access_token) {
				// ignore return value
				(
					supabase.auth as unknown as {
						setSession: (session: {
							access_token: string;
							refresh_token?: string;
						}) => Promise<void>;
					}
				).setSession({
					access_token: parsed.access_token,
					refresh_token: parsed.refresh_token,
				});
			}
		} catch (err) {
			// ignore malformed session
			console.error('Error restoring session from storage:', err);
		}
	}, []);

	// Insert records into the table
	const insert = useCallback(
		async (records: T[]) => {
			setLoading(true);
			setError(null);
			try {
				const { error: insertError } = await supabase
					.from(table)
					.insert(records);

				if (insertError) throw new Error(insertError.message);
				await fetchData();
			} catch (err) {
				setError(err instanceof Error ? err : new Error('Unknown error'));
			} finally {
				setLoading(false);
			}
		},
		[table, fetchData],
	);

	// Update a record in the table
	const update = useCallback(
		async (id: string | number, updates: Partial<T>) => {
			setLoading(true);
			setError(null);
			try {
				const { error: updateError } = await supabase
					.from(table)
					.update(updates)
					.eq('id', id);

				if (updateError) throw new Error(updateError.message);
				await fetchData();
			} catch (err) {
				setError(err instanceof Error ? err : new Error('Unknown error'));
			} finally {
				setLoading(false);
			}
		},
		[table, fetchData],
	);

	// Delete a record from the table
	const delete_ = useCallback(
		async (id: string | number) => {
			setLoading(true);
			setError(null);
			try {
				const { error: deleteError } = await supabase
					.from(table)
					.delete()
					.eq('id', id);

				if (deleteError) throw new Error(deleteError.message);
				await fetchData();
			} catch (err) {
				setError(err instanceof Error ? err : new Error('Unknown error'));
			} finally {
				setLoading(false);
			}
		},
		[table, fetchData],
	);

	return {
		data,
		error,
		loading,
		fetchData,
		insert,
		update,
		delete: delete_,
	};
}
