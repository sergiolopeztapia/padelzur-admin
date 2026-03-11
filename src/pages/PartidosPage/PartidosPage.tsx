import styles from './PartidosPage.module.css';
import Button from '@/components/Button/Button';
import Partido from '@/components/Partido/Partido';
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
							partidos.map((partido, index) => {
								return (
									<Partido
										key={`${partido.id ?? 'partido'}-${index}`}
										partido={partido}
										getJugadorName={getJugadorName}
										getPistaLabel={getPistaLabel}
										getEstadoLabel={getEstadoLabel}
										getResultadoByPartidoId={getResultadoByPartidoId}
										onUpsertResultado={onUpsertResultado}
										onEditPartido={onEditPartido}
										onDeletePartido={onDeletePartido}
									/>
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
