import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useSupabase } from '@/hooks/useSupabase';
import type { Clubes } from '@/types/Clubes';
import styles from '@/styles/dashboard.module.css';
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle';
import { Button } from '@/components/Button/Button';
import { Popup } from '@/components/Popup/Popup';
import { Logo } from '../Logo/Logo';

export function ClubsDashboard() {
	const {
		data: clubes,
		loading,
		error,
		fetchData,
		insert,
		update,
		delete: deleteClub,
	} = useSupabase<Clubes>({
		table: 'clubes',
	});

	const [editingId, setEditingId] = useState<number | null>(null);
	const [editingData, setEditingData] = useState<Partial<Clubes>>({});
	const [newClub, setNewClub] = useState({ nombre: '', ciudad: '' });
	const [showForm, setShowForm] = useState(false);
	const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
	const [pendingDeleteName, setPendingDeleteName] = useState<string>('');

	const handleLogout = async () => {
		try {
			await supabase.auth.signOut();
			sessionStorage.removeItem('supabase_session');
			window.location.href = '/login';
		} catch (error) {
			console.error('Error al cerrar sesión:', error);
		}
	};

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleAddClub = async () => {
		if (!newClub.nombre || !newClub.ciudad) return;
		await insert([
			{
				id: 0,
				nombre: newClub.nombre,
				ciudad: newClub.ciudad,
			},
		]);
		setNewClub({ nombre: '', ciudad: '' });
		setShowForm(false);
		fetchData();
	};

	const startEditing = (club: Clubes) => {
		setEditingId(club.id);
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

	const handleDeleteClub = (id: number, nombre: string) => {
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
			<div className={styles['dashboard-container']}>
				<div className={styles.loading}>Cargando clubes...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className={styles['dashboard-container']}>
				<div className={styles.error}>Error: {error.message}</div>
			</div>
		);
	}

	return (
		<div className={styles['dashboard-container']}>
			<header className={styles['dashboard-header']}>
				<div className={styles['header-left']}>
					<Logo />
				</div>
				<div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
					<ThemeToggle />
					<Button variant='logout' onClick={handleLogout} title='Cerrar sesión'>
						Cerrar sesión
					</Button>
				</div>
			</header>

			<div className={styles['dashboard-main']}>
				<div className={styles['dashboard-content']}>
					<div className={styles['action-bar']}>
						<Button variant='primary' onClick={() => setShowForm(true)}>
							+ Agregar Club
						</Button>
					</div>

					<Popup
						isOpen={showForm}
						title='Nuevo Club'
						onClose={() => setShowForm(false)}>
						<div className={styles['form-group']}>
							<input
								type='text'
								placeholder='Nombre del club'
								value={newClub.nombre}
								onChange={(e) =>
									setNewClub({ ...newClub, nombre: e.target.value })
								}
								className={styles['form-input']}
							/>
						</div>
						<div className={styles['form-group']}>
							<input
								type='text'
								placeholder='Ciudad'
								value={newClub.ciudad}
								onChange={(e) =>
									setNewClub({ ...newClub, ciudad: e.target.value })
								}
								className={styles['form-input']}
							/>
						</div>
						<div className={styles['form-actions']}>
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
						<div className={styles['form-actions']}>
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

					<div className={styles['clubs-grid']}>
						{clubes && clubes.length > 0 ? (
							clubes.map((club) => (
								<div key={club.id} className={styles['club-card']}>
									{editingId === club.id ? (
										<div className={styles['edit-form']}>
											<input
												type='text'
												value={editingData.nombre || ''}
												onChange={(e) =>
													setEditingData({
														...editingData,
														nombre: e.target.value,
													})
												}
												className={styles['form-input']}
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
												className={styles['form-input']}
											/>
											<div className={styles['form-actions']}>
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
											<div className={styles['club-info']}>
												<h3 className={styles['club-name']}>{club.nombre}</h3>
												<p className={styles['club-city']}>📍 {club.ciudad}</p>
												<span className={styles['club-id']}>ID: {club.id}</span>
											</div>
											<div className={styles['club-actions']}>
												<Button
													variant='edit'
													size='sm'
													onClick={() => startEditing(club)}>
													Editar
												</Button>
												<Button
													variant='danger'
													size='sm'
													onClick={() =>
														handleDeleteClub(club.id, club.nombre)
													}>
													Eliminar
												</Button>
											</div>
										</>
									)}
								</div>
							))
						) : (
							<div className={styles['empty-state']}>
								<p>No hay clubes registrados</p>
							</div>
						)}
					</div>

					<div className={styles.stats}>
						<div className={styles['stat-card']}>
							<span className={styles['stat-number']}>
								{clubes?.length || 0}
							</span>
							<span className={styles['stat-label']}>Clubes Totales</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
