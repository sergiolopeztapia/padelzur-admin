import { useEffect } from 'react';
import PartidoForm from '../components/PartidoForm';
import ConfirmAction from '@/components/Confirmation/ConfirmAction';
import { useSupabase } from '@/hooks/useSupabase';
import usePopupStore from '@/stores/usePopupStore';
import toast from 'react-hot-toast';
import type { Partido, UsePartidosPageResult } from './usePartidosPage.types';
import type { PartidoFormData } from '../components/PartidoForm.types';
import type { Jugador } from '../../JugadoresPage/hooks/useJugadoresPage.types';

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

	const { openPopup, closePopup } = usePopupStore();

	useEffect(() => {
		fetchData();
		fetchJugadores();
	}, [fetchData, fetchJugadores]);

	const getJugadorName = (id: number): string => {
		const jugador = jugadoresData?.find((j) => j.id === id);
		if (!jugador) return `ID: ${id}`;
		return jugador.apodo || jugador.nombre;
	};

	const mapFormDataToPartido = (formData: PartidoFormData) => ({
		id_jugador1_pareja1: formData.id_jugador1_pareja1,
		id_jugador2_pareja1: formData.id_jugador2_pareja1,
		id_jugador1_pareja2: formData.id_jugador1_pareja2,
		id_jugador2_pareja2: formData.id_jugador2_pareja2,
		id_pista: formData.id_pista,
		id_estado: formData.id_estado,
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
					}}
					onSubmit={async (formData: PartidoFormData) =>
						handleEditPartido(partidoId, formData)
					}
					jugadores={jugadoresData ?? []}
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
		loading: loading || jugadoresLoading,
		error,
		onAddPartido,
		onEditPartido,
		onDeletePartido,
		getJugadorName,
	};
}
