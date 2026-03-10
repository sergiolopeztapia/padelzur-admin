import { useEffect, useState } from 'react';
import Button from '@/components/Button/Button';
import InputField from '@/components/InputField/InputField';
import type { PartidoResultadoSetField } from '../../hooks/usePartidosPage.types';
import styles from './Resultado.module.css';
import type { ResultadoProps } from './Resultado.types';

type ResultadoDraft = Record<PartidoResultadoSetField, number | null>;

const EMPTY_RESULTADO: ResultadoDraft = {
	pareja1_set1: null,
	pareja1_set2: null,
	pareja1_set3: null,
	pareja2_set1: null,
	pareja2_set2: null,
	pareja2_set3: null,
};

const SET_OPTIONS = Array.from({ length: 8 }, (_, index) => index);
type ResultadoMode = 'THREE_SETS' | 'GAMES';

const toDraftFromResultado = (
	resultado?: ResultadoProps['resultado'],
): ResultadoDraft => ({
	pareja1_set1: resultado?.pareja1_set1 ?? null,
	pareja1_set2: resultado?.pareja1_set2 ?? null,
	pareja1_set3: resultado?.pareja1_set3 ?? null,
	pareja2_set1: resultado?.pareja2_set1 ?? null,
	pareja2_set2: resultado?.pareja2_set2 ?? null,
	pareja2_set3: resultado?.pareja2_set3 ?? null,
});

const isSameDraft = (a: ResultadoDraft, b: ResultadoDraft): boolean =>
	a.pareja1_set1 === b.pareja1_set1 &&
	a.pareja1_set2 === b.pareja1_set2 &&
	a.pareja1_set3 === b.pareja1_set3 &&
	a.pareja2_set1 === b.pareja2_set1 &&
	a.pareja2_set2 === b.pareja2_set2 &&
	a.pareja2_set3 === b.pareja2_set3;

function Resultado({
	pareja1Label,
	pareja2Label,
	resultado,
	onSaveResultado,
	disabled = false,
}: ResultadoProps) {
	const [draft, setDraft] = useState<ResultadoDraft>(EMPTY_RESULTADO);
	const [mode, setMode] = useState<ResultadoMode>('THREE_SETS');
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		const nextDraft = toDraftFromResultado(resultado);
		setDraft(nextDraft);
		setMode(
			nextDraft.pareja1_set2 != null ||
				nextDraft.pareja1_set3 != null ||
				nextDraft.pareja2_set2 != null ||
				nextDraft.pareja2_set3 != null
				? 'THREE_SETS'
				: 'GAMES',
		);
	}, [resultado]);

	const hasUnsavedChanges = !isSameDraft(
		draft,
		toDraftFromResultado(resultado),
	);

	const hasGamesOverSeven =
		(draft.pareja1_set1 ?? 0) > 7 || (draft.pareja2_set1 ?? 0) > 7;

	const handleSetChange = (
		field: PartidoResultadoSetField,
		value: number | null,
	) => {
		setDraft((prev) => ({ ...prev, [field]: value }));
	};

	const handleModeChange = (nextMode: ResultadoMode) => {
		if (nextMode === 'THREE_SETS' && hasGamesOverSeven) {
			return;
		}

		setMode(nextMode);
	};

	const handleSave = async () => {
		if (disabled || saving) return;
		setSaving(true);

		try {
			await onSaveResultado(draft);
		} finally {
			setSaving(false);
		}
	};

	const renderSetSelect = (field: PartidoResultadoSetField, label: string) => (
		<select
			aria-label={label}
			className={styles.setSelect}
			value={draft[field] ?? ''}
			onChange={(e) => {
				const nextValue =
					e.target.value === '' ? null : parseInt(e.target.value, 10);
				handleSetChange(field, nextValue);
			}}
			disabled={disabled || saving}>
			<option value=''>-</option>
			{SET_OPTIONS.map((option) => (
				<option key={option} value={option}>
					{option}
				</option>
			))}
		</select>
	);

	const renderGamesInput = (field: PartidoResultadoSetField, label: string) => (
		<div className={styles.gamesInputWrap}>
			<InputField
				type='number'
				name={label}
				value={draft[field] == null ? '' : String(draft[field])}
				onChange={(e) => {
					const raw = e.target.value;
					if (raw === '') {
						handleSetChange(field, null);
						return;
					}

					const parsed = parseInt(raw, 10);
					handleSetChange(field, Number.isNaN(parsed) ? null : parsed);
				}}
				disabled={disabled || saving}
				placeholder='0'
			/>
		</div>
	);

	return (
		<div className={styles.resultadoContainer}>
			<p className={styles.resultadoTitle}>Resultado</p>
			<div className={styles.modeRow}>
				<span className={styles.modeLabel}>Tipo</span>
				<select
					className={styles.modeSelect}
					value={mode}
					onChange={(e) => handleModeChange(e.target.value as ResultadoMode)}
					disabled={disabled || saving}>
					<option value='THREE_SETS' disabled={hasGamesOverSeven}>
						A 3 sets
					</option>
					<option value='GAMES'>Por juegos (1 set)</option>
				</select>
			</div>
			<div
				className={`${styles.resultadoGrid} ${mode === 'GAMES' ? styles.resultadoGridGames : ''}`}>
				<div
					className={`${styles.resultadoHeader} ${styles.resultadoHeaderName}`}>
					Pareja
				</div>
				<div className={styles.resultadoHeader}>
					{mode === 'GAMES' ? 'Juegos' : 'Set 1'}
				</div>
				{mode === 'THREE_SETS' && (
					<div className={styles.resultadoHeader}>Set 2</div>
				)}
				{mode === 'THREE_SETS' && (
					<div className={styles.resultadoHeader}>Set 3</div>
				)}

				<div className={styles.parejaName}>{pareja1Label}</div>
				{mode === 'GAMES'
					? renderGamesInput('pareja1_set1', 'Pareja 1 juegos')
					: renderSetSelect('pareja1_set1', 'Pareja 1 Set 1')}
				{mode === 'THREE_SETS' &&
					renderSetSelect('pareja1_set2', 'Pareja 1 Set 2')}
				{mode === 'THREE_SETS' &&
					renderSetSelect('pareja1_set3', 'Pareja 1 Set 3')}

				<div className={styles.parejaName}>{pareja2Label}</div>
				{mode === 'GAMES'
					? renderGamesInput('pareja2_set1', 'Pareja 2 juegos')
					: renderSetSelect('pareja2_set1', 'Pareja 2 Set 1')}
				{mode === 'THREE_SETS' &&
					renderSetSelect('pareja2_set2', 'Pareja 2 Set 2')}
				{mode === 'THREE_SETS' &&
					renderSetSelect('pareja2_set3', 'Pareja 2 Set 3')}
			</div>
			<div className={styles.resultadoActions}>
				<Button
					variant='success'
					size='sm'
					onClick={handleSave}
					disabled={disabled || saving || !hasUnsavedChanges}>
					{saving ? 'Guardando...' : 'Actualizar resultado'}
				</Button>
			</div>
		</div>
	);
}

export default Resultado;
