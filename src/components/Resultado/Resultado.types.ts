import type {
	PartidoResultadoDraft,
	PartidoResultado,
} from '../../pages/PartidosPage/hooks/usePartidosPage.types';

export type ResultadoProps = Readonly<{
	pareja1Label: string;
	pareja2Label: string;
	resultado?: PartidoResultado;
	onSaveResultado: (resultado: PartidoResultadoDraft) => Promise<void>;
	disabled?: boolean;
}>;
