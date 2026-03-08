import styles from './JugadoresPage.module.css';
import Button from '@/components/Button/Button';
import useJugadoresPage from './hooks/useJugadoresPage';

function JugadoresPage() {
	const {
		jugadores,
		loading,
		error,
		onAddJugador,
		onEditJugador,
		onDeleteJugador,
	} = useJugadoresPage();

	if (loading || error) {
		return (
			<div className={styles.container}>
				<div className={styles.loading}>
					{loading ? 'Cargando jugador...' : `Error: ${error?.message}`}
				</div>
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<div className={styles.dashboardMain}>
				<div className={styles.dashboardContent}>
					<div className={styles.actionBar}>
						<Button variant='primary' onClick={onAddJugador}>
							+ Agregar Jugador
						</Button>
					</div>

					<div className={styles.clubsGrid}>
						{jugadores.length > 0 ? (
							jugadores.map((jugador) => (
								<div key={jugador.id} className={styles.clubCard}>
									<div className={styles.clubInfo}>
										<h3 className={styles.clubName}>
											<span className={styles.apodoHighlight}>
												{jugador.apodo}
											</span>
										</h3>
										<p className={styles.clubCity}>Nombre: {jugador.nombre}</p>
										<p className={styles.clubCity}>
											{jugador.apellido1}
											{jugador.apellido2 ? ` ${jugador.apellido2}` : ''}
										</p>
										<p className={styles.clubCity}>
											Telefono: {jugador.telefono}
										</p>
										<p className={styles.clubCity}>
											Nacimiento: {jugador.fecha_nac}
										</p>
										<p className={styles.clubCity}>
											Lado: {jugador.lado} | Sexo: {jugador.sexo}
										</p>
										<span className={styles.clubId}>ID: {jugador.id}</span>
									</div>
									<div className={styles.clubActions}>
										<Button
											variant='edit'
											size='sm'
											onClick={() => onEditJugador(jugador)}>
											Editar
										</Button>
										<Button
											variant='danger'
											size='sm'
											onClick={() => onDeleteJugador(jugador)}>
											Eliminar
										</Button>
									</div>
								</div>
							))
						) : (
							<div className={styles.emptyState}>
								<p>No hay jugadores registrados</p>
							</div>
						)}
					</div>

					<div className={styles.stats}>
						<div className={styles.statCard}>
							<span className={styles.statNumber}>{jugadores.length}</span>
							<span className={styles.statLabel}>Jugadores Totales</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default JugadoresPage;
