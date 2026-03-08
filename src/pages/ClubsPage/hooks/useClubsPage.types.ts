import type { Club } from '@/types/Club.types';

export type UseClubsPageResult = Readonly<{
	clubs: Club[];
	loading: boolean;
	error: Error | null;
	onAddClub: () => void;
	onEditClub: (club: Club) => void;
	onDeleteClub: (club: Club) => void;
}>;
