import { useEffect, useState } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import type { Club } from '@/types/Club.types';
import styles from './ClubsPage.module.css';
import { Button } from '@/components/Button/Button';
import { Popup } from '@/components/Popup/Popup';
import Header from '@/features/Header/Header';

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

	const [editingId, setEditingId] = useState<number | null>(null);
	const [editingData, setEditingData] = useState<Partial<Club>>({});
	const [newClub, setNewClub] = useState({ nombre: '', ciudad: '' });
	const [showForm, setShowForm] = useState(false);
	const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
	const [pendingDeleteName, setPendingDeleteName] = useState<string>('');

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleAddClub = async () => {
		if (!newClub.nombre || !newClub.ciudad) return;
		await insert([
			{
				id: null, // Deja que Supabase asigne el ID automáticamente
				nombre: newClub.nombre,
				ciudad: newClub.ciudad,
			},
		]);
		setNewClub({ nombre: '', ciudad: '' });
		setShowForm(false);
		fetchData();
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
		setPendingDeleteId(id);
		setPendingDeleteName(nombre);
	};

	const confirmDeleteClub = async () => {
		if (pendingDeleteId === null) return;
		await deleteClub(pendingDeleteId);
		setPendingDeleteId(null);
		setPendingDeleteName('');
		fetchData();
	};

	if (loading) {
		return (
			<div className={styles.dashboardContainer}>
				<div className={styles.loading}>Cargando club...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className={styles.dashboardContainer}>
				<div className={styles.error}>Error: {error.message}</div>
			</div>
		);
	}

	return (
		<div className={styles.dashboardContainer}>
			<Header />

			<div className={styles.dashboardMain}>
				<div className={styles.dashboardContent}>
					<div className={styles.actionBar}>
						<Button variant='primary' onClick={() => setShowForm(true)}>
							+ Agregar Club
						</Button>
					</div>

					<Popup
						isOpen={showForm}
						title='Nuevo Club'
						onClose={() => setShowForm(false)}>
						<div className={styles.formGroup}>
							<input
								type='text'
								placeholder='Nombre del club'
								value={newClub.nombre}
								onChange={(e) =>
									setNewClub({ ...newClub, nombre: e.target.value })
								}
								className={styles.formInput}
							/>
						</div>
						<div className={styles.formGroup}>
							<input
								type='text'
								placeholder='Ciudad'
								value={newClub.ciudad}
								onChange={(e) =>
									setNewClub({ ...newClub, ciudad: e.target.value })
								}
								className={styles.formInput}
							/>
						</div>
						<div className={styles.formActions}>
							<Button variant='success' onClick={handleAddClub}>
								Guardar
							</Button>
							<Button variant='secondary' onClick={() => setShowForm(false)}>
								Cancelar
							</Button>
						</div>
					</Popup>

					<Popup
						isOpen={pendingDeleteId !== null}
						title='Confirmar eliminación'
						onClose={() => {
							setPendingDeleteId(null);
							setPendingDeleteName('');
						}}>
						<p>
							¿Estás seguro de que deseas eliminar el club{' '}
							<strong>{pendingDeleteName}</strong>?
						</p>
						<div className={styles.formActions}>
							<Button variant='danger' onClick={confirmDeleteClub}>
								Eliminar
							</Button>
							<Button
								variant='secondary'
								onClick={() => {
									setPendingDeleteId(null);
									setPendingDeleteName('');
								}}>
								Cancelar
							</Button>
						</div>
					</Popup>

					<div className={styles.clubsGrid}>
						{club && club.length > 0 ? (
							club.map((club) => (
								<div key={club.id} className={styles.clubCard}>
									{editingId === club.id ? (
										<div className={styles.editForm}>
											<input
												type='text'
												value={editingData.nombre || ''}
												onChange={(e) =>
													setEditingData({
														...editingData,
														nombre: e.target.value,
													})
												}
												className={styles.formInput}
											/>
											<input
												type='text'
												value={editingData.ciudad || ''}
												onChange={(e) =>
													setEditingData({
														...editingData,
														ciudad: e.target.value,
													})
												}
												className={styles.formInput}
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
