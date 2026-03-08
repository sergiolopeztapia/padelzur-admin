import styles from './ClubsPage.module.css';
import Button from '@/components/Button/Button';
import useClubsPage from './hooks/useClubsPage';

function ClubsPage() {
	const { clubs, loading, error, onAddClub, onEditClub, onDeleteClub } =
		useClubsPage();

	if (loading || error) {
		return (
			<div className={styles.container}>
				<div className={styles.loading}>
					{loading ? 'Cargando club...' : `Error: ${error?.message}`}
				</div>
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<div className={styles.dashboardMain}>
				<div className={styles.dashboardContent}>
					<div className={styles.actionBar}>
						<Button variant='primary' onClick={onAddClub}>
							+ Agregar Club
						</Button>
					</div>

					<div className={styles.clubsGrid}>
						{clubs.length > 0 ? (
							clubs.map((club) => (
								<div key={club.id} className={styles.clubCard}>
									<div className={styles.clubInfo}>
										<h3 className={styles.clubName}>{club.nombre}</h3>
										<p className={styles.clubCity}>{club.ciudad}</p>
										<span className={styles.clubId}>ID: {club.id}</span>
									</div>
									<div className={styles.clubActions}>
										<Button
											variant='edit'
											size='sm'
											onClick={() => onEditClub(club)}>
											Editar
										</Button>
										<Button
											variant='danger'
											size='sm'
											onClick={() => onDeleteClub(club)}>
											Eliminar
										</Button>
									</div>
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
							<span className={styles.statNumber}>{clubs.length}</span>
							<span className={styles.statLabel}>Club Totales</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ClubsPage;
