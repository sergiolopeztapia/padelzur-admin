import { useRef, useState } from 'react';
import html2canvas from 'html2canvas-pro';
import Button from '@/components/Button/Button';
import Resultado from '@/components/Resultado/Resultado';
import styles from './Partido.module.css';
import usePartido from './hooks/usePartido';
import type { PartidoProps } from './Partido.types';

function Partido(props: PartidoProps) {
	const cardRef = useRef<HTMLDivElement>(null);
	const [exporting, setExporting] = useState(false);

	const {
		partidoId,
		pareja1Label,
		pareja2Label,
		pistaLabel,
		estadoLabel,
		fechaLabel,
		resultado,
		handleSaveResultado,
		handleEdit,
		handleDelete,
		disabled,
	} = usePartido(props);

	const handleExportJpg = async () => {
		if (exporting) return;

		const captureTarget = cardRef.current;
		if (!captureTarget) return;

		setExporting(true);

		try {
			const canvas = await html2canvas(captureTarget, {
				scale: Math.min(window.devicePixelRatio || 1, 2),
				useCORS: true,
				backgroundColor: '#ffffff',
				foreignObjectRendering: false,
				ignoreElements: (element) =>
					element instanceof HTMLElement &&
					element.dataset.exportIgnore === 'true',
				onclone: (clonedDoc) => {
					clonedDoc
						.querySelectorAll('[data-export-ignore="true"]')
						.forEach((node) => {
							if (node instanceof HTMLElement) {
								node.style.display = 'none';
							}
						});
				},
			});

			const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
			if (!dataUrl || dataUrl === 'data:,') {
				throw new Error('No se pudo generar el archivo JPG.');
			}

			const anchor = document.createElement('a');
			anchor.href = dataUrl;
			anchor.download = `partido-${partidoId ?? 'sin-id'}.jpg`;
			document.body.append(anchor);
			anchor.click();
			anchor.remove();
		} catch (error) {
			console.error('Error exportando partido a JPG', error);
			window.alert(
				'No se pudo exportar la imagen JPG del partido. Revisa la consola para mas detalle.',
			);
		} finally {
			setExporting(false);
		}
	};

	return (
		<div className={styles.card} ref={cardRef}>
			<div className={styles.info}>
				<h3 className={styles.name}>Partido #{partidoId ?? 'N/A'}</h3>
				<Resultado
					pareja1Label={pareja1Label}
					pareja2Label={pareja2Label}
					resultado={resultado}
					onSaveResultado={handleSaveResultado}
					disabled={disabled}
				/>
				<p className={styles.meta}>Pista: {pistaLabel}</p>
				<p className={styles.meta}>Estado: {estadoLabel}</p>
				<p className={styles.meta}>Fecha: {fechaLabel}</p>
				<span className={styles.idBadge}>ID: {partidoId ?? 'N/A'}</span>
			</div>
			<div className={styles.actions}>
				<Button
					variant='secondary'
					size='sm'
					onClick={handleExportJpg}
					disabled={exporting}
					data-export-ignore='true'>
					{exporting ? 'Exportando...' : 'Exportar JPG'}
				</Button>
				<Button variant='edit' size='sm' onClick={handleEdit}>
					Editar
				</Button>
				<Button variant='danger' size='sm' onClick={handleDelete}>
					Eliminar
				</Button>
			</div>
		</div>
	);
}

export default Partido;
