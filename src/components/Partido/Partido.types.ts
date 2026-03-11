import type {
	Partido,
	PartidoResultado,
	PartidoResultadoDraft,
} from '../../pages/PartidosPage/hooks/usePartidosPage.types';

export type PartidoProps = Readonly<{
	partido: Partido;
	getJugadorName: (id: number) => string;
	getPistaLabel: (id: number) => string;
	getEstadoLabel: (id: number) => string;
	getResultadoByPartidoId: (partidoId: number) => PartidoResultado | undefined;
	onUpsertResultado: (
		partidoId: number,
		resultado: PartidoResultadoDraft,
	) => Promise<void>;
	onEditPartido: (partido: Partido) => void;
	onDeletePartido: (partido: Partido) => void;
}>;
