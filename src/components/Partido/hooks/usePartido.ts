import { useCallback, useMemo } from 'react';
import type { PartidoResultadoDraft } from '../../../pages/PartidosPage/hooks/usePartidosPage.types';
import type { PartidoProps } from '../Partido.types';

const formatFecha = (fecha?: string | null): string => {
	if (!fecha) return 'Sin fecha';

	const date = new Date(fecha);
	if (Number.isNaN(date.getTime())) return 'Sin fecha';

	return new Intl.DateTimeFormat('es-ES', {
		dateStyle: 'medium',
		timeStyle: 'short',
	}).format(date);
};

export default function usePartido({
	partido,
	getJugadorName,
	getPistaLabel,
	getEstadoLabel,
	getResultadoByPartidoId,
	onUpsertResultado,
	onEditPartido,
	onDeletePartido,
}: PartidoProps) {
	const partidoId = partido.id;

	const pareja1Label = useMemo(
		() =>
			`${getJugadorName(partido.id_jugador1_pareja1)} & ${getJugadorName(partido.id_jugador2_pareja1)}`,
		[getJugadorName, partido.id_jugador1_pareja1, partido.id_jugador2_pareja1],
	);

	const pareja2Label = useMemo(
		() =>
			`${getJugadorName(partido.id_jugador1_pareja2)} & ${getJugadorName(partido.id_jugador2_pareja2)}`,
		[getJugadorName, partido.id_jugador1_pareja2, partido.id_jugador2_pareja2],
	);

	const pistaLabel = useMemo(
		() => getPistaLabel(partido.id_pista),
		[getPistaLabel, partido.id_pista],
	);

	const estadoLabel = useMemo(
		() => getEstadoLabel(partido.id_estado),
		[getEstadoLabel, partido.id_estado],
	);

	const fechaLabel = useMemo(() => formatFecha(partido.fecha), [partido.fecha]);

	const resultado = useMemo(
		() => (partidoId != null ? getResultadoByPartidoId(partidoId) : undefined),
		[getResultadoByPartidoId, partidoId],
	);

	const handleSaveResultado = useCallback(
		(draftResultado: PartidoResultadoDraft) => {
			if (partidoId == null) return Promise.resolve();
			return onUpsertResultado(partidoId, draftResultado);
		},
		[partidoId, onUpsertResultado],
	);

	const handleEdit = useCallback(() => {
		onEditPartido(partido);
	}, [onEditPartido, partido]);

	const handleDelete = useCallback(() => {
		onDeletePartido(partido);
	}, [onDeletePartido, partido]);

	return {
		partidoId,
		pareja1Label,
		pareja2Label,
		pistaLabel,
		estadoLabel,
		fechaLabel,
		resultado,
		handleSaveResultado,
		handleEdit,
		handleDelete,
		disabled: partidoId == null,
	};
}
