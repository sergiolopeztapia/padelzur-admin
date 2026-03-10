import type { Jugador } from '../../JugadoresPage/hooks/useJugadoresPage.types';
import type { Pista } from '../../PistasPage/hooks/usePistasPage.types';

export type Partido = Readonly<{
	id?: number | null;
	id_jugador1_pareja1: number;
	id_jugador2_pareja1: number;
	id_jugador1_pareja2: number;
	id_jugador2_pareja2: number;
	id_pista: number;
	id_estado: number;
}>;

export type PartidoEstado = Readonly<{
	id?: number | null;
	nombre?: string | null;
	descripcion?: string | null;
}> &
	Record<string, unknown>;

export type UsePartidosPageResult = Readonly<{
	partidos: Partido[];
	jugadores: Jugador[];
	pistas: Pista[];
	estados: PartidoEstado[];
	loading: boolean;
	error: Error | null;
	onAddPartido: () => void;
	onEditPartido: (partido: Partido) => void;
	onDeletePartido: (partido: Partido) => void;
	getJugadorName: (id: number) => string;
	getPistaLabel: (id: number) => string;
	getEstadoLabel: (id: number) => string;
}>;
