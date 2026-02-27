export type UseSupabaseOptions = Readonly<{
	table: string;
}>;

export type UseSupabaseResult<T> = Readonly<{
	data: T[] | null;
	error: Error | null;
	loading: boolean;
	fetchData: () => Promise<void>;
	insert: (records: T[]) => Promise<void>;
	update: (id: string | number, updates: Partial<T>) => Promise<void>;
	delete: (id: string | number) => Promise<void>;
}>;
