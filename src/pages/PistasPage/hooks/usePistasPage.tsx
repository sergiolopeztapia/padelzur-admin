import { useEffect } from 'react';
import PistaForm from '../components/PistaForm';
import ConfirmAction from '@/components/Confirmation/ConfirmAction';
import { useSupabase } from '@/hooks/useSupabase';
import usePopupStore from '@/stores/usePopupStore';
import toast from 'react-hot-toast';
import type { Pista, UsePistasPageResult } from './usePistasPage.types';
import type { PistaFormData } from '../components/PistaForm.types';
import type { Club } from '../../ClubsPage/hooks/useClubsPage.types';

export default function usePistasPage(): UsePistasPageResult {
	const {
		data,
		loading,
		error,
		fetchData,
		insert,
		update,
		delete: deletePista,
	} = useSupabase<Pista>({
		table: 'pistas',
	});

	const {
		data: clubesData,
		loading: clubesLoading,
		fetchData: fetchClubes,
	} = useSupabase<Club>({
		table: 'clubes',
	});

	const { openPopup, closePopup } = usePopupStore();

	useEffect(() => {
		fetchData();
		fetchClubes();
	}, [fetchData, fetchClubes]);

	const getClubLabel = (id: number): string => {
		const club = clubesData?.find((item) => item.id === id);
		if (!club) return `Club ID: ${id}`;
		return `${club.nombre} (${club.ciudad})`;
	};

	const mapFormDataToPista = (formData: PistaFormData) => ({
		id_club: formData.id_club,
		nombre: formData.nombre,
		superficie: formData.superficie,
		tipo: formData.tipo,
	});

	const handleAddPista = async (formData: PistaFormData) => {
		try {
			await insert([mapFormDataToPista(formData)]);
			closePopup();
			fetchData();
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : 'Error al crear pista',
			);
		}
	};

	const handleEditPista = async (pistaId: number, formData: PistaFormData) => {
		try {
			await update(pistaId, mapFormDataToPista(formData));
			closePopup();
			fetchData();
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : 'Error al editar pista',
			);
		}
	};

	const onAddPista = () => {
		openPopup({
			title: 'Nueva Pista',
			children: (
				<PistaForm onSubmit={handleAddPista} clubs={clubesData ?? []} />
			),
		});
	};

	const onEditPista = (pista: Pista) => {
		if (pista.id == null) return;
		const pistaId = pista.id;

		openPopup({
			title: 'Editar Pista',
			children: (
				<PistaForm
					initialData={{
						id_club: pista.id_club,
						nombre: pista.nombre,
						superficie: pista.superficie,
						tipo: pista.tipo,
					}}
					onSubmit={async (formData: PistaFormData) =>
						handleEditPista(pistaId, formData)
					}
					clubs={clubesData ?? []}
				/>
			),
		});
	};

	const onDeletePista = (pista: Pista) => {
		const { id, nombre } = pista;

		const confirmDeletePista = async () => {
			if (id == null) return;
			try {
				await deletePista(id);
				fetchData();
			} catch (error) {
				toast.error(
					error instanceof Error ? error.message : 'Error al eliminar pista',
				);
			}
		};

		openPopup({
			title: 'Confirmar eliminación',
			children: (
				<ConfirmAction
					message={
						<>
							¿Estás seguro de que deseas eliminar la pista{' '}
							<strong>{nombre}</strong>?
						</>
					}
					confirmText='Eliminar'
					onConfirm={confirmDeletePista}
					onCancel={closePopup}
				/>
			),
		});
	};

	return {
		pistas: data ?? [],
		loading: loading || clubesLoading,
		error,
		onAddPista,
		onEditPista,
		onDeletePista,
		getClubLabel,
	};
}
