import { useMemo, useState } from 'react';
import styles from './JugadoresPage.module.css';
import Button from '@/components/Button/Button';
import InputField from '@/components/InputField/InputField';
import useJugadoresPage from './hooks/useJugadoresPage';

function JugadoresPage() {
	const [searchTerm, setSearchTerm] = useState('');
	const [expandedPlayerIds, setExpandedPlayerIds] = useState<
		Record<string, boolean>
	>({});

	const togglePlayerDetails = (jugadorId: string) => {
		setExpandedPlayerIds((prev) => ({
			...prev,
			[jugadorId]: !prev[jugadorId],
		}));
	};

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

		const sortByApodo = (items: typeof jugadores) =>
			[...items].sort((a, b) =>
				a.apodo.localeCompare(b.apodo, 'es', { sensitivity: 'base' }),
			);

		const query = normalizeValue(searchTerm.trim());
		if (!query) return sortByApodo(jugadores);

		const filtered = jugadores.filter((jugador) => {
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

		return sortByApodo(filtered);
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
							filteredJugadores.map((jugador) => {
								const playerKey =
									jugador.id != null
										? String(jugador.id)
										: `no-id-${jugador.apodo}-${jugador.nombre}`;
								const imageId = jugador.id ?? 0;
								const isDetailsVisible = !!expandedPlayerIds[playerKey];

								return (
									<div key={playerKey} className={styles.clubCard}>
										<div className={styles.clubAvatar}>
											<img
												src={`/jugador_${imageId}.png`}
												alt={jugador.apodo}
												className={styles.clubAvatarImg}
												onError={(e) => {
													const img = e.currentTarget as HTMLImageElement;
													img.src = '/jugador_0.png';
													img.classList.add(styles.clubAvatarImgDefault);
													img.onerror = null;
												}}
											/>
										</div>
										<div className={styles.clubInfo}>
											<h3 className={styles.clubName}>
												<span className={styles.apodoHighlight}>
													{jugador.apodo}
												</span>
											</h3>
											<div className={styles.playerControlsRow}>
												<span className={styles.playerIdBadge}>
													ID: {jugador.id ?? '-'}
												</span>
												<Button
													variant='secondary'
													size='sm'
													iconName={isDetailsVisible ? 'EyeOff' : 'Eye'}
													iconSize={16}
													aria-label={
														isDetailsVisible ? 'Ocultar datos' : 'Mostrar datos'
													}
													title={
														isDetailsVisible ? 'Ocultar datos' : 'Mostrar datos'
													}
													className={`${styles.iconActionButton} ${styles.toggleDetailsButton}`}
													onClick={() => togglePlayerDetails(playerKey)}
													type='button'
												/>
												<Button
													variant='edit'
													size='sm'
													iconName='Pencil'
													iconSize={16}
													aria-label='Editar jugador'
													title='Editar jugador'
													className={styles.iconActionButton}
													onClick={() => onEditJugador(jugador)}
													type='button'
												/>
												<Button
													variant='danger'
													size='sm'
													iconName='Trash2'
													iconSize={16}
													aria-label='Eliminar jugador'
													title='Eliminar jugador'
													className={styles.iconActionButton}
													onClick={() => onDeleteJugador(jugador)}
													type='button'
												/>
											</div>
											{isDetailsVisible && (
												<>
													<p className={styles.clubCity}>
														Nombre: {jugador.nombre}
													</p>
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
												</>
											)}
										</div>
									</div>
								);
							})
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
