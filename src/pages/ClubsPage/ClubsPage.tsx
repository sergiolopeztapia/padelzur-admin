import { useEffect, useState } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import type { Club } from '@/types/Club.types';
import styles from './ClubsPage.module.css';
import { Button } from '@/components/Button/Button';
import { InputField } from '@/components/InputField/InputField';
import usePopupStore from '@/stores/usePopupStore';
import Header from '@/features/Header/Header';
import { AddClubForm } from '@/components/Popup/AddClubForm';
import { DeleteConfirmation } from '@/components/Popup/DeleteConfirmation';

function ClubsPage() {
	const {
		data: club,
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

	const [editingId, setEditingId] = useState<number | null>(null);
	const [editingData, setEditingData] = useState<Partial<Club>>({});

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleAddClub = async (data: { nombre: string; ciudad: string }) => {
		await insert([
			{
				nombre: data.nombre,
				ciudad: data.ciudad,
			},
		]);
		closePopup();
		fetchData();
	};

	const openAddClubPopup = () => {
		openPopup({
			title: 'Nuevo Club',
			children: <AddClubForm onSubmit={handleAddClub} />,
		});
	};

	const startEditing = (club: Club) => {
		setEditingId(club.id ?? null);
		setEditingData(club);
	};

	const handleUpdateClub = async () => {
		if (editingId && editingData.nombre && editingData.ciudad) {
			await update(editingId, {
				nombre: editingData.nombre,
				ciudad: editingData.ciudad,
			});
			setEditingId(null);
			setEditingData({});
			fetchData();
		}
	};

	const handleDeleteClub = (club: Club) => {
		const { id, nombre } = club;

		const confirmDeleteClub = async () => {
			if (id == null) return;
			await deleteClub(id);
			fetchData();
		};

		openPopup({
			title: 'Confirmar eliminación',
			children: (
				<DeleteConfirmation itemName={nombre} onConfirm={confirmDeleteClub} />
			),
		});
	};

	if (loading) {
		return (
			<div className={styles.container}>
				<div className={styles.loading}>Cargando club...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className={styles.container}>
				<div className={styles.error}>Error: {error.message}</div>
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<Header />

			<div className={styles.dashboardMain}>
				<div className={styles.dashboardContent}>
					<div className={styles.actionBar}>
						<Button variant='primary' onClick={openAddClubPopup}>
							+ Agregar Club
						</Button>
					</div>

					<div className={styles.clubsGrid}>
						{club && club.length > 0 ? (
							club.map((club) => (
								<div key={club.id} className={styles.clubCard}>
									{editingId === club.id ? (
										<div className={styles.editForm}>
											<InputField
												type='text'
												placeholder='Nombre del club'
												value={editingData.nombre || ''}
												onChange={(e) =>
													setEditingData({
														...editingData,
														nombre: e.target.value,
													})
												}
											/>
											<InputField
												type='text'
												placeholder='Ciudad'
												value={editingData.ciudad || ''}
												onChange={(e) =>
													setEditingData({
														...editingData,
														ciudad: e.target.value,
													})
												}
											/>
											<div className={styles.formActions}>
												<Button
													variant='success'
													size='sm'
													onClick={handleUpdateClub}>
													Guardar
												</Button>
												<Button
													variant='secondary'
													size='sm'
													onClick={() => setEditingId(null)}>
													Cancelar
												</Button>
											</div>
										</div>
									) : (
										<>
											<div className={styles.clubInfo}>
												<h3 className={styles.clubName}>{club.nombre}</h3>
												<p className={styles.clubCity}>📍 {club.ciudad}</p>
												<span className={styles.clubId}>ID: {club.id}</span>
											</div>
											<div className={styles.clubActions}>
												<Button
													variant='edit'
													size='sm'
													onClick={() => startEditing(club)}>
													Editar
												</Button>
												<Button
													variant='danger'
													size='sm'
													onClick={() => handleDeleteClub(club)}>
													Eliminar
												</Button>
											</div>
										</>
									)}
								</div>
							))
						) : (
							<div className={styles.emptyState}>
								<p>No hay club registrados</p>
							</div>
						)}
					</div>

					<div className={styles.stats}>
						<div className={styles.statCard}>
							<span className={styles.statNumber}>{club?.length || 0}</span>
							<span className={styles.statLabel}>Club Totales</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ClubsPage;
