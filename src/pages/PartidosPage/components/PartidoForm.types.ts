import type { Jugador } from '../../JugadoresPage/hooks/useJugadoresPage.types';

export type PartidoFormData = {
	id_jugador1_pareja1: number;
	id_jugador2_pareja1: number;
	id_jugador1_pareja2: number;
	id_jugador2_pareja2: number;
	id_pista: number;
	id_estado: number;
};

export type PartidoFormProps = Readonly<{
	onSubmit: (data: PartidoFormData) => Promise<void>;
	initialData?: PartidoFormData;
	submitText?: string;
	jugadores: Jugador[];
}>;
