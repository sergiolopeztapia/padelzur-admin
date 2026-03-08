export enum JugadorLado {
	DRIVE = 'DRIVE',
	REVES = 'REVES',
	AMBOS = 'AMBOS',
}

export enum JugadorSexo {
	H = 'H',
	M = 'M',
}

export type Jugador = Readonly<{
	id?: number | null;
	nombre: string;
	apodo: string;
	telefono: string;
	apellido1: string;
	apellido2: string | null;
	fecha_nac: string;
	lado: JugadorLado;
	sexo: JugadorSexo;
}>;

export type UseJugadoresPageResult = Readonly<{
	jugadores: Jugador[];
	loading: boolean;
	error: Error | null;
	onAddJugador: () => void;
	onEditJugador: (jugador: Jugador) => void;
	onDeleteJugador: (jugador: Jugador) => void;
}>;
