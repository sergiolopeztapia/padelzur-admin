import styles from './PartidosPage.module.css';
import Button from '@/components/Button/Button';
import usePartidosPage from './hooks/usePartidosPage';

function PartidosPage() {
	const {
		partidos,
		loading,
		error,
		onAddPartido,
		onEditPartido,
		onDeletePartido,
		getJugadorName,
		getPistaLabel,
		getEstadoLabel,
	} = usePartidosPage();

	if (loading || error) {
		return (
			<div className={styles.container}>
				<div className={styles.loading}>
					{loading ? 'Cargando partidos...' : `Error: ${error?.message}`}
				</div>
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<div className={styles.dashboardMain}>
				<div className={styles.dashboardContent}>
					<div className={styles.actionBar}>
						<Button variant='primary' onClick={onAddPartido}>
							+ Agregar Partido
						</Button>
					</div>

					<div className={styles.clubsGrid}>
						{partidos.length > 0 ? (
							partidos.map((partido) => (
								<div key={partido.id} className={styles.clubCard}>
									<div className={styles.clubInfo}>
										<h3 className={styles.clubName}>Partido #{partido.id}</h3>
										<div className={styles.parejaSection}>
											<p className={styles.parejaLabel}>Pareja 1</p>
											<p className={styles.clubCity}>
												{getJugadorName(partido.id_jugador1_pareja1)} &{' '}
												{getJugadorName(partido.id_jugador2_pareja1)}
											</p>
										</div>
										<div className={styles.parejaSection}>
											<p className={styles.parejaLabel}>Pareja 2</p>
											<p className={styles.clubCity}>
												{getJugadorName(partido.id_jugador1_pareja2)} &{' '}
												{getJugadorName(partido.id_jugador2_pareja2)}
											</p>
										</div>
										<p className={styles.clubCity}>
											Pista: {getPistaLabel(partido.id_pista)}
										</p>
										<p className={styles.clubCity}>
											Estado: {getEstadoLabel(partido.id_estado)}
										</p>
										<span className={styles.clubId}>ID: {partido.id}</span>
									</div>
									<div className={styles.clubActions}>
										<Button
											variant='edit'
											size='sm'
											onClick={() => onEditPartido(partido)}>
											Editar
										</Button>
										<Button
											variant='danger'
											size='sm'
											onClick={() => onDeletePartido(partido)}>
											Eliminar
										</Button>
									</div>
								</div>
							))
						) : (
							<div className={styles.emptyState}>
								<p>No hay partidos registrados</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default PartidosPage;
