export enum PistaSuperficie {
	ROJO = 'ROJO',
	AZUL = 'AZUL',
	VERDE = 'VERDE',
}

export enum PistaTipo {
	MURO = 'MURO',
	CRISTAL = 'CRISTAL',
}

export type Pista = Readonly<{
	id?: number | null;
	id_club: number;
	nombre: string;
	superficie: PistaSuperficie;
	tipo: PistaTipo;
}>;

export type UsePistasPageResult = Readonly<{
	pistas: Pista[];
	loading: boolean;
	error: Error | null;
	onAddPista: () => void;
	onEditPista: (pista: Pista) => void;
	onDeletePista: (pista: Pista) => void;
}>;
