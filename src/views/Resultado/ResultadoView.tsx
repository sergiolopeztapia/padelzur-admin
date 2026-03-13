import { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas-pro';
import { Menu } from 'lucide-react';
import styles from './ResultadoView.module.css';

type ExportAction = 'download' | 'copy';

export type TeamRow = {
	player1: string;
	player2: string;
	score: string; // "4 6 6" (en la imagen se ve como 466)
};

export type ResultadoViewProps = {
	eventLeft: string; // "GIJÓN P2"
	eventLeftNote?: string;
	roundRight: string; // "DIECISEISAVOS/R32"
	roundRightNote?: string;
	teamA: TeamRow;
	teamB: TeamRow;
	photoUrl?: string; // legacy, ya no se usa en esta vista
	brandTop?: string; // "PADEL"
	brandBottom?: string; // "ZUR"
};

const PLAYER_IMAGES = [
	{ src: '/AntonioValverde.png', fallbackSrc: '/Foto1.png' },
	{ src: '/Jaku.png', fallbackSrc: '/Foto2.png' },
	{ src: '/RafaEspana.png', fallbackSrc: '/Foto3.png' },
	{ src: '/Baron.png', fallbackSrc: '/Foto4.png' },
];

export function ResultadoView({
	eventLeft,
	eventLeftNote = '',
	roundRight,
	roundRightNote = '',
	teamA,
	teamB,
	brandTop = 'PADELZUR',
	brandBottom = '',
}: ResultadoViewProps) {
	const captureRef = useRef<HTMLDivElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);
	const [busyAction, setBusyAction] = useState<ExportAction | null>(null);
	const [menuOpen, setMenuOpen] = useState(false);
	const losingTeam = getLosingTeam(teamA.score, teamB.score);
	void brandTop;
	void brandBottom;
	const isBusy = busyAction != null;

	useEffect(() => {
		if (!menuOpen) {
			return;
		}

		const handlePointerDown = (event: MouseEvent) => {
			if (!menuRef.current?.contains(event.target as Node)) {
				setMenuOpen(false);
			}
		};

		document.addEventListener('mousedown', handlePointerDown);

		return () => {
			document.removeEventListener('mousedown', handlePointerDown);
		};
	}, [menuOpen]);

	const renderCanvasFromView = async (): Promise<HTMLCanvasElement> => {
		const captureTarget = captureRef.current;

		if (!captureTarget) {
			throw new Error('No se encontro el contenido para exportar.');
		}

		const cloneContainer = document.createElement('div');
		const cloneTarget = captureTarget.cloneNode(true) as HTMLDivElement;

		cloneContainer.style.position = 'fixed';
		cloneContainer.style.left = '-10000px';
		cloneContainer.style.top = '0';
		cloneContainer.style.pointerEvents = 'none';
		cloneContainer.style.opacity = '0';
		cloneContainer.style.zIndex = '-1';
		cloneContainer.append(cloneTarget);
		document.body.append(cloneContainer);

		try {
			inlineStylesRecursively(captureTarget, cloneTarget);

			cloneTarget
				.querySelectorAll('[data-export-ignore="true"]')
				.forEach((node) => {
					node.remove();
				});

			const canvas = await html2canvas(cloneTarget, {
				scale: Math.min(window.devicePixelRatio || 1, 2),
				useCORS: true,
				backgroundColor: '#0b1631',
				foreignObjectRendering: false,
			});

			return canvas;
		} finally {
			cloneContainer.remove();
		}
	};

	const handleExportJpg = async () => {
		if (isBusy) return;
		setMenuOpen(false);

		setBusyAction('download');

		try {
			const canvas = await renderCanvasFromView();

			const dataUrl = canvas.toDataURL('image/jpeg', 1);
			if (!dataUrl || dataUrl === 'data:,') {
				throw new Error('No se pudo generar el archivo JPG.');
			}

			const safeName = slugify(`${eventLeft}-${roundRight}`) || 'resultado';
			const anchor = document.createElement('a');
			anchor.href = dataUrl;
			anchor.download = `${safeName}.jpg`;
			document.body.append(anchor);
			anchor.click();
			anchor.remove();
		} catch (error) {
			console.error('Error exportando ResultadoView a JPG', error);
			window.alert(
				'No se pudo exportar la imagen JPG del resultado. Revisa la consola para mas detalle.',
			);
		} finally {
			setBusyAction(null);
		}
	};

	const handleCopyImage = async () => {
		if (isBusy) return;
		setMenuOpen(false);

		setBusyAction('copy');

		try {
			if (!navigator.clipboard?.write || typeof ClipboardItem === 'undefined') {
				throw new Error(
					'El portapapeles no soporta imagenes en este navegador.',
				);
			}

			const canvas = await renderCanvasFromView();
			const blob = await canvasToBlob(canvas, 'image/png', 1);

			await navigator.clipboard.write([
				new ClipboardItem({
					'image/png': blob,
				}),
			]);

			window.alert('Imagen copiada al portapapeles.');
		} catch (error) {
			console.error('Error copiando ResultadoView al portapapeles', error);
			window.alert(
				'No se pudo copiar la imagen al portapapeles. Revisa la consola para mas detalle.',
			);
		} finally {
			setBusyAction(null);
		}
	};

	return (
		<div className={styles.root} ref={captureRef}>
			<div
				className={styles.exportMenu}
				data-export-ignore='true'
				ref={menuRef}>
				<button
					type='button'
					className={styles.menuButton}
					onClick={() => setMenuOpen((prev) => !prev)}
					disabled={isBusy}
					aria-label='Opciones de exportacion'
					aria-haspopup='menu'
					aria-expanded={menuOpen}>
					<Menu size={18} />
				</button>

				{menuOpen ? (
					<div className={styles.exportDropdown} role='menu'>
						<button
							type='button'
							className={styles.exportButton}
							onClick={handleExportJpg}
							disabled={isBusy}
							role='menuitem'>
							{busyAction === 'download' ? 'Exportando...' : 'Descargar JPG'}
						</button>
						<button
							type='button'
							className={`${styles.exportButton} ${styles.exportButtonSecondary}`}
							onClick={handleCopyImage}
							disabled={isBusy}
							role='menuitem'>
							{busyAction === 'copy' ? 'Copiando...' : 'Copiar imagen'}
						</button>
					</div>
				) : null}
			</div>

			<div className={styles.playersStrip} aria-label='players strip'>
				{PLAYER_IMAGES.map((image, index) => (
					<div className={styles.playerSlot} key={`player-${index + 1}`}>
						<img
							src={image.src}
							alt={`Foto jugador ${index + 1}`}
							className={styles.playerSilhouette}
							onError={(event) => {
								const target = event.currentTarget;
								if (target.src.endsWith(image.fallbackSrc)) {
									target.src = '/player-silhouette.svg';
									return;
								}

								target.src = image.fallbackSrc;
							}}
						/>
					</div>
				))}
				<div className={styles.vsBadge} aria-hidden>
					<img src='/vs.png' alt='VS' className={styles.vsImage} />
				</div>
			</div>

			<div className={styles.board}>
				<div className={styles.bar}>
					<div className={styles.barLeftBlock}>
						<div className={styles.barLeft}>{eventLeft}</div>
						{eventLeftNote ? (
							<div className={styles.barLeftNote}>{eventLeftNote}</div>
						) : null}
					</div>
					<div className={styles.barRightBlock}>
						<div className={styles.barRight}>{roundRight}</div>
						{roundRightNote ? (
							<div className={styles.barRightNote}>{roundRightNote}</div>
						) : null}
					</div>
				</div>

				<div className={styles.rows}>
					<Row
						team={teamA}
						muted={losingTeam === 'A'}
						winner={losingTeam === 'B'}
					/>
					<div className={styles.divider} />
					<Row
						team={teamB}
						muted={losingTeam === 'B'}
						winner={losingTeam === 'A'}
					/>
				</div>
			</div>

			{/* <div className={styles.brand}>
				<span className={styles.brandLabel}>Patrocinado por:</span>
				<img
					src='/tienda_padel_point.jpg'
					alt='Tienda Padel Point'
					className={styles.brandLogo}
				/>
				<img
					src='/linea_bella.jpg'
					alt='Clinica de estética Linea Bella'
					className={styles.brandLogo}
				/>
			</div> */}
		</div>
	);
}

async function canvasToBlob(
	canvas: HTMLCanvasElement,
	type: string,
	quality?: number,
): Promise<Blob> {
	const blob = await new Promise<Blob | null>((resolve) => {
		canvas.toBlob(resolve, type, quality);
	});

	if (!blob) {
		throw new Error('No se pudo generar la imagen para copiar.');
	}

	return blob;
}

function Row({
	team,
	muted,
	winner,
}: {
	team: TeamRow;
	muted?: boolean;
	winner?: boolean;
}) {
	const scoreParts = splitScore(team.score);

	return (
		<div className={styles.row}>
			<div className={styles.left}>
				<div
					className={styles.winnerBadge}
					aria-label={winner ? 'ganador' : undefined}>
					{winner ? (
						<img
							src='/trofeo.png'
							alt='Trofeo'
							className={styles.trophyImage}
						/>
					) : null}
				</div>

				<div className={styles.names}>
					<div className={`${styles.name} ${muted ? styles.nameMuted : ''}`}>
						{team.player1}
					</div>
					<div className={`${styles.name} ${muted ? styles.nameMuted : ''}`}>
						{team.player2}
					</div>
				</div>
			</div>

			<div className={styles.right}>
				<div
					className={styles.score}
					aria-label={`score ${scoreParts.join(' ')}`}>
					{scoreParts.map((value, index) => (
						<span
							key={`${value}-${index}`}
							className={
								value === '6' ? styles.scoreStrong : styles.scoreFaded
							}>
							{value}
						</span>
					))}
				</div>
			</div>
		</div>
	);
}

function inlineStylesRecursively(source: Element, target: Element): void {
	if (source instanceof HTMLElement && target instanceof HTMLElement) {
		const computed = window.getComputedStyle(source);

		for (let index = 0; index < computed.length; index += 1) {
			const property = computed.item(index);
			target.style.setProperty(
				property,
				computed.getPropertyValue(property),
				computed.getPropertyPriority(property),
			);
		}

		syncFormValues(source, target);
	}

	const sourceChildren = Array.from(source.children);
	const targetChildren = Array.from(target.children);
	const childCount = Math.min(sourceChildren.length, targetChildren.length);

	for (let index = 0; index < childCount; index += 1) {
		inlineStylesRecursively(sourceChildren[index], targetChildren[index]);
	}
}

function syncFormValues(source: HTMLElement, target: HTMLElement): void {
	if (
		source instanceof HTMLInputElement &&
		target instanceof HTMLInputElement
	) {
		target.value = source.value;
		target.checked = source.checked;
		return;
	}

	if (
		source instanceof HTMLTextAreaElement &&
		target instanceof HTMLTextAreaElement
	) {
		target.value = source.value;
		return;
	}

	if (
		source instanceof HTMLSelectElement &&
		target instanceof HTMLSelectElement
	) {
		target.value = source.value;
		target.selectedIndex = source.selectedIndex;
	}
}

function slugify(value: string): string {
	return value
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

function splitScore(score: string): string[] {
	const cleanScore = score.trim();

	if (!cleanScore) {
		return [];
	}

	return cleanScore.includes(' ')
		? cleanScore.split(/\s+/)
		: cleanScore.split('');
}

function getLosingTeam(
	teamAScore: string,
	teamBScore: string,
): 'A' | 'B' | null {
	const teamASets = splitScore(teamAScore).map((value) =>
		Number.parseInt(value, 10),
	);
	const teamBSets = splitScore(teamBScore).map((value) =>
		Number.parseInt(value, 10),
	);
	const setCount = Math.min(teamASets.length, teamBSets.length);

	let teamAWonSets = 0;
	let teamBWonSets = 0;

	for (let index = 0; index < setCount; index += 1) {
		const aSet = teamASets[index];
		const bSet = teamBSets[index];

		if (Number.isNaN(aSet) || Number.isNaN(bSet)) {
			continue;
		}

		if (aSet > bSet) {
			teamAWonSets += 1;
		} else if (bSet > aSet) {
			teamBWonSets += 1;
		}
	}

	if (teamAWonSets === teamBWonSets) {
		return null;
	}

	return teamAWonSets > teamBWonSets ? 'B' : 'A';
}
