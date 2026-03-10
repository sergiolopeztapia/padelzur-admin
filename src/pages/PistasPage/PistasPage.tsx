import styles from './PistasPage.module.css';
import Button from '@/components/Button/Button';
import usePistasPage from './hooks/usePistasPage';

function PistasPage() {
	const {
		pistas,
		loading,
		error,
		onAddPista,
		onEditPista,
		onDeletePista,
		getClubLabel,
	} = usePistasPage();

	if (loading || error) {
		return (
			<div className={styles.container}>
				<div className={styles.loading}>
					{loading ? 'Cargando pistas...' : `Error: ${error?.message}`}
				</div>
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<div className={styles.dashboardMain}>
				<div className={styles.dashboardContent}>
					<div className={styles.actionBar}>
						<Button variant='primary' onClick={onAddPista}>
							+ Agregar Pista
						</Button>
					</div>

					<div className={styles.clubsGrid}>
						{pistas.length > 0 ? (
							pistas.map((pista) => (
								<div key={pista.id} className={styles.clubCard}>
									<div className={styles.clubInfo}>
										<h3 className={styles.clubName}>{pista.nombre}</h3>
										<p className={styles.clubCity}>
											Club: {getClubLabel(pista.id_club)}
										</p>
										<p className={styles.clubCity}>
											Superficie:{' '}
											<span className={styles.pistaSuperficie}>
												{pista.superficie}
											</span>
										</p>
										<p className={styles.clubCity}>Tipo: {pista.tipo}</p>
										<span className={styles.clubId}>ID: {pista.id}</span>
									</div>
									<div className={styles.clubActions}>
										<Button
											variant='edit'
											size='sm'
											onClick={() => onEditPista(pista)}>
											Editar
										</Button>
										<Button
											variant='danger'
											size='sm'
											onClick={() => onDeletePista(pista)}>
											Eliminar
										</Button>
									</div>
								</div>
							))
						) : (
							<div className={styles.emptyState}>
								<p>No hay pistas registradas</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default PistasPage;
