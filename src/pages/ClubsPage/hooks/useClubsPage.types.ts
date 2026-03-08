export type Club = Readonly<{
	id?: number | null; // Permitir null para nuevos registros sin ID asignado
	nombre: string;
	ciudad: string;
}>;

export type UseClubsPageResult = Readonly<{
	clubs: Club[];
	loading: boolean;
	error: Error | null;
	onAddClub: () => void;
	onEditClub: (club: Club) => void;
	onDeleteClub: (club: Club) => void;
}>;
