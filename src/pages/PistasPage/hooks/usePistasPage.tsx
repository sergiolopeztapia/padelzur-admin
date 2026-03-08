import { useEffect } from 'react';
import PistaForm from '../components/PistaForm';
import ConfirmAction from '@/components/Confirmation/ConfirmAction';
import { useSupabase } from '@/hooks/useSupabase';
import usePopupStore from '@/stores/usePopupStore';
import toast from 'react-hot-toast';
import type { Pista, UsePistasPageResult } from './usePistasPage.types';
import type { PistaFormData } from '../components/PistaForm.types';

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

	const { openPopup, closePopup } = usePopupStore();

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const mapFormDataToPista = (formData: PistaFormData) => ({
		id_club: 1, // TODO: Get from session or club context
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
			children: <PistaForm onSubmit={handleAddPista} />,
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
						nombre: pista.nombre,
						superficie: pista.superficie,
						tipo: pista.tipo,
					}}
					onSubmit={async (formData: PistaFormData) =>
						handleEditPista(pistaId, formData)
					}
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
		loading,
		error,
		onAddPista,
		onEditPista,
		onDeletePista,
	};
}
