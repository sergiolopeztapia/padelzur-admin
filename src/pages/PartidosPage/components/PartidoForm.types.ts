import type { Jugador } from '../../JugadoresPage/hooks/useJugadoresPage.types';
import type { Pista } from '../../PistasPage/hooks/usePistasPage.types';
import type { PartidoEstado } from '../hooks/usePartidosPage.types';

export type PartidoFormData = {
	id_jugador1_pareja1: number;
	id_jugador2_pareja1: number;
	id_jugador1_pareja2: number;
	id_jugador2_pareja2: number;
	id_pista: number;
	id_estado: number;
	fecha: string;
};

export type PartidoFormProps = Readonly<{
	onSubmit: (data: PartidoFormData) => Promise<void>;
	initialData?: PartidoFormData;
	submitText?: string;
	jugadores: Jugador[];
	pistas: Pista[];
	estados: PartidoEstado[];
	getPistaLabel: (id: number) => string;
}>;
