import styles from './PartidosPage.module.css';
import Button from '@/components/Button/Button';
import Resultado from './components/Resultado/Resultado';
import usePartidosPage from './hooks/usePartidosPage';

const formatFecha = (fecha?: string | null): string => {
	if (!fecha) return 'Sin fecha';

	const date = new Date(fecha);
	if (Number.isNaN(date.getTime())) return 'Sin fecha';

	return new Intl.DateTimeFormat('es-ES', {
		dateStyle: 'medium',
		timeStyle: 'short',
	}).format(date);
};

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
		getResultadoByPartidoId,
		onUpsertResultado,
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
							partidos.map((partido) => {
								const pareja1Label = `${getJugadorName(partido.id_jugador1_pareja1)} & ${getJugadorName(partido.id_jugador2_pareja1)}`;
								const pareja2Label = `${getJugadorName(partido.id_jugador1_pareja2)} & ${getJugadorName(partido.id_jugador2_pareja2)}`;
								const resultado =
									partido.id != null
										? getResultadoByPartidoId(partido.id)
										: undefined;

								return (
									<div key={partido.id} className={styles.clubCard}>
										<div className={styles.clubInfo}>
											<h3 className={styles.clubName}>Partido #{partido.id}</h3>
											<Resultado
												pareja1Label={pareja1Label}
												pareja2Label={pareja2Label}
												resultado={resultado}
												onSaveResultado={(draftResultado) => {
													if (partido.id == null) return Promise.resolve();
													return onUpsertResultado(partido.id, draftResultado);
												}}
												disabled={partido.id == null}
											/>
											<p className={styles.clubCity}>
												Pista: {getPistaLabel(partido.id_pista)}
											</p>
											<p className={styles.clubCity}>
												Estado: {getEstadoLabel(partido.id_estado)}
											</p>
											<p className={styles.clubCity}>
												Fecha: {formatFecha(partido.fecha)}
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
								);
							})
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
