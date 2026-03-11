import { useRef, useState } from 'react';
import html2canvas from 'html2canvas-pro';
import styles from './ResultadoView.module.css';

export type TeamRow = {
	player1: string;
	player2: string;
	score: string; // "4 6 6" (en la imagen se ve como 466)
};

export type ResultadoViewProps = {
	eventLeft: string; // "GIJÓN P2"
	roundRight: string; // "DIECISEISAVOS/R32"
	teamA: TeamRow;
	teamB: TeamRow;
	photoUrl?: string; // legacy, ya no se usa en esta vista
	brandTop?: string; // "PADEL"
	brandBottom?: string; // "ZUR"
};

const PLAYER_IMAGES = [
	{ src: '/Foto1.jpg', fallbackSrc: '/Foto1.png' },
	{ src: '/Foto2.jpg', fallbackSrc: '/Foto2.png' },
	{ src: '/Foto3.jpg', fallbackSrc: '/Foto3.png' },
	{ src: '/Foto4.jpg', fallbackSrc: '/Foto4.png' },
];

export function ResultadoView({
	eventLeft,
	roundRight,
	teamA,
	teamB,
	brandTop = 'PADELZUR',
	brandBottom = '',
}: ResultadoViewProps) {
	const captureRef = useRef<HTMLDivElement>(null);
	const [exporting, setExporting] = useState(false);
	const losingTeam = getLosingTeam(teamA.score, teamB.score);
	const brandLabel = `${brandTop}${brandBottom}`.trim();

	const handleExportJpg = async () => {
		if (exporting) return;

		const captureTarget = captureRef.current;
		if (!captureTarget) return;

		setExporting(true);

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
			cloneContainer.remove();
			setExporting(false);
		}
	};

	return (
		<div className={styles.root} ref={captureRef}>
			<button
				type='button'
				className={styles.exportButton}
				onClick={handleExportJpg}
				disabled={exporting}
				data-export-ignore='true'>
				{exporting ? 'Exportando...' : 'Exportar JPG'}
			</button>

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
			</div>

			<div className={styles.board}>
				<div className={styles.bar}>
					<div className={styles.barLeft}>{eventLeft}</div>
					<div className={styles.barRight}>{roundRight}</div>
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

			<div className={styles.brand}>
				<div className={styles.brandText}>{brandLabel}</div>
			</div>
		</div>
	);
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
