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
	fecha?: string | null;
}>;

export type PartidoEstado = Readonly<{
	id?: number | null;
	nombre?: string | null;
	descripcion?: string | null;
}> &
	Record<string, unknown>;

export type PartidoResultado = Readonly<{
	id?: number | null;
	id_partido: number;
	pareja1_set1?: number | null;
	pareja1_set2?: number | null;
	pareja1_set3?: number | null;
	pareja2_set1?: number | null;
	pareja2_set2?: number | null;
	pareja2_set3?: number | null;
}>;

export type PartidoResultadoSetField =
	| 'pareja1_set1'
	| 'pareja1_set2'
	| 'pareja1_set3'
	| 'pareja2_set1'
	| 'pareja2_set2'
	| 'pareja2_set3';

export type PartidoResultadoDraft = Record<
	PartidoResultadoSetField,
	number | null
>;

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
	getResultadoByPartidoId: (partidoId: number) => PartidoResultado | undefined;
	onUpsertResultado: (
		partidoId: number,
		resultado: PartidoResultadoDraft,
	) => Promise<void>;
}>;
