import { useEffect } from 'react';
import ClubForm from '../components/ClubForm';
import ConfirmAction from '@/components/Confirmation/ConfirmAction';
import { useSupabase } from '@/hooks/useSupabase';
import usePopupStore from '@/stores/usePopupStore';
import toast from 'react-hot-toast';
import type { Club, UseClubsPageResult } from './useClubsPage.types';
import type { ClubFormData } from '../components/ClubForm.types';

export default function useClubsPage(): UseClubsPageResult {
	const {
		data,
		loading,
		error,
		fetchData,
		insert,
		update,
		delete: deleteClub,
	} = useSupabase<Club>({
		table: 'clubes',
	});

	const { openPopup, closePopup } = usePopupStore();

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleAddClub = async (formData: ClubFormData) => {
		try {
			await insert([
				{
					nombre: formData.nombre,
					ciudad: formData.ciudad,
				},
			]);
			closePopup();
			fetchData();
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : 'Error al crear club',
			);
		}
	};

	const handleEditClub = async (clubId: number, formData: ClubFormData) => {
		try {
			await update(clubId, formData);
			closePopup();
			fetchData();
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : 'Error al editar club',
			);
		}
	};

	const onAddClub = () => {
		openPopup({
			title: 'Nuevo Club',
			children: <ClubForm onSubmit={handleAddClub} />,
		});
	};

	const onEditClub = (club: Club) => {
		if (club.id == null) return;
		const clubId = club.id;

		openPopup({
			title: 'Editar Club',
			children: (
				<ClubForm
					initialData={{ nombre: club.nombre, ciudad: club.ciudad }}
					onSubmit={async (formData) => handleEditClub(clubId, formData)}
				/>
			),
		});
	};

	const onDeleteClub = (club: Club) => {
		const { id, nombre } = club;

		const confirmDeleteClub = async () => {
			if (id == null) return;
			try {
				await deleteClub(id);
				fetchData();
			} catch (error) {
				toast.error(
					error instanceof Error ? error.message : 'Error al eliminar club',
				);
			}
		};

		openPopup({
			title: 'Confirmar eliminación',
			children: (
				<ConfirmAction
					message={
						<>
							¿Estás seguro de que deseas eliminar el club{' '}
							<strong>{nombre}</strong>?
						</>
					}
					confirmText='Eliminar'
					onConfirm={confirmDeleteClub}
					onCancel={closePopup}
				/>
			),
		});
	};

	return {
		clubs: data ?? [],
		loading,
		error,
		onAddClub,
		onEditClub,
		onDeleteClub,
	};
}
