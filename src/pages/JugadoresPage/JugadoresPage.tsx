import { useMemo, useState } from 'react';
import styles from './JugadoresPage.module.css';
import Button from '@/components/Button/Button';
import InputField from '@/components/InputField/InputField';
import useJugadoresPage from './hooks/useJugadoresPage';

function JugadoresPage() {
	const [searchTerm, setSearchTerm] = useState('');

	const {
		jugadores,
		loading,
		error,
		onAddJugador,
		onEditJugador,
		onDeleteJugador,
	} = useJugadoresPage();

	const filteredJugadores = useMemo(() => {
		const normalizeValue = (value: string) =>
			value
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '')
				.toLowerCase();

		const query = normalizeValue(searchTerm.trim());
		if (!query) return jugadores;

		return jugadores.filter((jugador) => {
			const apellidos =
				`${jugador.apellido1} ${jugador.apellido2 ?? ''}`.trim();

			return [
				jugador.apodo,
				jugador.nombre,
				jugador.apellido1,
				jugador.apellido2 ?? '',
				apellidos,
			].some((value) => normalizeValue(value).includes(query));
		});
	}, [jugadores, searchTerm]);

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
						<div className={styles.searchInputWrapper}>
							<InputField
								type='text'
								placeholder='Buscar por apodo, nombre o apellido'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								name='jugadores-search'
								autoComplete='off'
							/>
						</div>
						<Button variant='primary' onClick={onAddJugador}>
							+ Agregar Jugador
						</Button>
					</div>

					<div className={styles.clubsGrid}>
						{filteredJugadores.length > 0 ? (
							filteredJugadores.map((jugador) => (
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
								<p>
									{searchTerm.trim().length > 0
										? 'No hay jugadores que coincidan con la busqueda'
										: 'No hay jugadores registrados'}
								</p>
							</div>
						)}
					</div>

					<div className={styles.stats}>
						<div className={styles.statCard}>
							<span className={styles.statNumber}>
								{filteredJugadores.length}
							</span>
							<span className={styles.statLabel}>
								{searchTerm.trim().length > 0
									? `Jugadores filtrados de ${jugadores.length}`
									: 'Jugadores Totales'}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default JugadoresPage;
