import { useEffect } from 'react';
import PartidoForm from '../components/PartidoForm';
import ConfirmAction from '@/components/Confirmation/ConfirmAction';
import { useSupabase } from '@/hooks/useSupabase';
import usePopupStore from '@/stores/usePopupStore';
import toast from 'react-hot-toast';
import type {
	Partido,
	PartidoEstado,
	PartidoResultadoDraft,
	PartidoResultado,
	UsePartidosPageResult,
} from './usePartidosPage.types';
import type { PartidoFormData } from '../components/PartidoForm.types';
import type { Jugador } from '../../JugadoresPage/hooks/useJugadoresPage.types';
import type { Pista } from '../../PistasPage/hooks/usePistasPage.types';
import type { Club } from '../../ClubsPage/hooks/useClubsPage.types';

export default function usePartidosPage(): UsePartidosPageResult {
	const {
		data,
		loading,
		error,
		fetchData,
		insert,
		update,
		delete: deletePartido,
	} = useSupabase<Partido>({
		table: 'partidos',
	});

	const {
		data: jugadoresData,
		loading: jugadoresLoading,
		fetchData: fetchJugadores,
	} = useSupabase<Jugador>({
		table: 'jugadores',
	});

	const {
		data: pistasData,
		loading: pistasLoading,
		fetchData: fetchPistas,
	} = useSupabase<Pista>({
		table: 'pistas',
	});

	const {
		data: estadosData,
		loading: estadosLoading,
		fetchData: fetchEstados,
	} = useSupabase<PartidoEstado>({
		table: 'partidos_estados',
	});

	const {
		data: clubesData,
		loading: clubesLoading,
		fetchData: fetchClubes,
	} = useSupabase<Club>({
		table: 'clubes',
	});

	const {
		data: resultadosData,
		fetchData: fetchResultados,
		insert: insertResultado,
		update: updateResultado,
	} = useSupabase<PartidoResultado>({
		table: 'partidos_resultados',
	});

	const { openPopup, closePopup } = usePopupStore();

	useEffect(() => {
		fetchData();
		fetchJugadores();
		fetchPistas();
		fetchEstados();
		fetchClubes();
		fetchResultados();
	}, [
		fetchData,
		fetchJugadores,
		fetchPistas,
		fetchEstados,
		fetchClubes,
		fetchResultados,
	]);

	const getJugadorName = (id: number): string => {
		const jugador = jugadoresData?.find((j) => j.id === id);
		if (!jugador) return `ID: ${id}`;
		return jugador.apodo || jugador.nombre;
	};

	const getClubLabel = (id: number): string => {
		const club = clubesData?.find((item) => item.id === id);
		if (!club) return `Club ID: ${id}`;
		return `${club.nombre} (${club.ciudad})`;
	};

	const getPistaLabel = (id: number): string => {
		const pista = pistasData?.find((p) => p.id === id);
		if (!pista) return `ID: ${id}`;

		const clubLabel = getClubLabel(pista.id_club);
		return `${pista.nombre} (${pista.superficie} · ${pista.tipo}) - ${clubLabel}`;
	};

	const getEstadoLabel = (id: number): string => {
		const estado = estadosData?.find((item) => item.id === id);
		if (!estado) return 'Sin estado';

		if (typeof estado.nombre === 'string' && estado.nombre.trim().length > 0) {
			return estado.nombre;
		}

		if (
			typeof estado['estado'] === 'string' &&
			estado['estado'].trim().length > 0
		) {
			return estado['estado'];
		}

		return 'Sin estado';
	};

	const getResultadoByPartidoId = (
		partidoId: number,
	): PartidoResultado | undefined =>
		resultadosData?.find((resultado) => resultado.id_partido === partidoId);

	const onUpsertResultado = async (
		partidoId: number,
		resultado: PartidoResultadoDraft,
	) => {
		try {
			const existingResultado = getResultadoByPartidoId(partidoId);
			const payload: Partial<PartidoResultado> = { ...resultado };

			if (existingResultado?.id != null) {
				await updateResultado(existingResultado.id, payload);
				return;
			}

			await insertResultado([
				{
					id_partido: partidoId,
					...payload,
				},
			]);
		} catch (resultError) {
			toast.error(
				resultError instanceof Error
					? resultError.message
					: 'No se pudo guardar el resultado',
			);
		}
	};

	const mapFormDataToPartido = (formData: PartidoFormData) => ({
		id_jugador1_pareja1: formData.id_jugador1_pareja1,
		id_jugador2_pareja1: formData.id_jugador2_pareja1,
		id_jugador1_pareja2: formData.id_jugador1_pareja2,
		id_jugador2_pareja2: formData.id_jugador2_pareja2,
		id_pista: formData.id_pista,
		id_estado: formData.id_estado,
		fecha: new Date(formData.fecha).toISOString(),
	});

	const handleAddPartido = async (formData: PartidoFormData) => {
		try {
			await insert([mapFormDataToPartido(formData)]);
			closePopup();
			fetchData();
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : 'Error al crear partido',
			);
		}
	};

	const handleEditPartido = async (
		partidoId: number,
		formData: PartidoFormData,
	) => {
		try {
			await update(partidoId, mapFormDataToPartido(formData));
			closePopup();
			fetchData();
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : 'Error al editar partido',
			);
		}
	};

	const onAddPartido = () => {
		openPopup({
			title: 'Nuevo Partido',
			children: (
				<PartidoForm
					onSubmit={handleAddPartido}
					jugadores={jugadoresData ?? []}
					pistas={pistasData ?? []}
					estados={estadosData ?? []}
					getPistaLabel={getPistaLabel}
				/>
			),
		});
	};

	const onEditPartido = (partido: Partido) => {
		if (partido.id == null) return;
		const partidoId = partido.id;

		openPopup({
			title: 'Editar Partido',
			children: (
				<PartidoForm
					initialData={{
						id_jugador1_pareja1: partido.id_jugador1_pareja1,
						id_jugador2_pareja1: partido.id_jugador2_pareja1,
						id_jugador1_pareja2: partido.id_jugador1_pareja2,
						id_jugador2_pareja2: partido.id_jugador2_pareja2,
						id_pista: partido.id_pista,
						id_estado: partido.id_estado,
						fecha: partido.fecha ?? '',
					}}
					onSubmit={async (formData: PartidoFormData) =>
						handleEditPartido(partidoId, formData)
					}
					jugadores={jugadoresData ?? []}
					pistas={pistasData ?? []}
					estados={estadosData ?? []}
					getPistaLabel={getPistaLabel}
				/>
			),
		});
	};

	const onDeletePartido = (partido: Partido) => {
		const { id } = partido;

		const confirmDeletePartido = async () => {
			if (id == null) return;
			try {
				await deletePartido(id);
				fetchData();
			} catch (error) {
				toast.error(
					error instanceof Error ? error.message : 'Error al eliminar partido',
				);
			}
		};

		openPopup({
			title: 'Confirmar eliminación',
			children: (
				<ConfirmAction
					message={
						<>
							¿Estás seguro de que deseas eliminar el partido{' '}
							<strong>#{id}</strong>?
						</>
					}
					confirmText='Eliminar'
					onConfirm={confirmDeletePartido}
					onCancel={closePopup}
				/>
			),
		});
	};

	return {
		partidos: data ?? [],
		jugadores: jugadoresData ?? [],
		pistas: pistasData ?? [],
		estados: estadosData ?? [],
		loading:
			loading ||
			jugadoresLoading ||
			pistasLoading ||
			estadosLoading ||
			clubesLoading,
		error,
		onAddPartido,
		onEditPartido,
		onDeletePartido,
		getJugadorName,
		getPistaLabel,
		getEstadoLabel,
		getResultadoByPartidoId,
		onUpsertResultado,
	};
}
