import { useState } from 'react';
import Button from '@/components/Button/Button';
import InputField from '@/components/InputField/InputField';
import usePopupStore from '@/stores/usePopupStore';
import toast from 'react-hot-toast';
import type { PartidoFormData, PartidoFormProps } from './PartidoForm.types';
import styles from './PartidoForm.module.css';

function PartidoForm({
	onSubmit,
	initialData,
	submitText = 'Guardar',
	jugadores,
}: PartidoFormProps) {
	const { closePopup } = usePopupStore();
	const [formData, setFormData] = useState<PartidoFormData>({
		id_jugador1_pareja1: initialData?.id_jugador1_pareja1 ?? 1,
		id_jugador2_pareja1: initialData?.id_jugador2_pareja1 ?? 1,
		id_jugador1_pareja2: initialData?.id_jugador1_pareja2 ?? 1,
		id_jugador2_pareja2: initialData?.id_jugador2_pareja2 ?? 1,
		id_pista: initialData?.id_pista ?? 1,
		id_estado: initialData?.id_estado ?? 1,
	});

	const handleSubmit = async () => {
		if (
			!formData.id_jugador1_pareja1 ||
			!formData.id_jugador2_pareja1 ||
			!formData.id_jugador1_pareja2 ||
			!formData.id_jugador2_pareja2 ||
			!formData.id_pista ||
			!formData.id_estado
		) {
			toast.error('Todos los campos son requeridos');
			return;
		}

		try {
			await onSubmit(formData);
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: 'No se pudo guardar el partido',
			);
		}
	};

	return (
		<>
			<div className={styles.section}>
				<label className={styles.sectionLabel}>Pareja 1</label>
				<select
					className={styles.selectField}
					value={formData.id_jugador1_pareja1}
					onChange={(e) =>
						setFormData({
							...formData,
							id_jugador1_pareja1: parseInt(e.target.value),
						})
					}>
					{jugadores.map((jugador) => (
						<option key={jugador.id} value={jugador.id ?? 0}>
							{jugador.apodo || jugador.nombre}
						</option>
					))}
				</select>
				<select
					className={styles.selectField}
					value={formData.id_jugador2_pareja1}
					onChange={(e) =>
						setFormData({
							...formData,
							id_jugador2_pareja1: parseInt(e.target.value),
						})
					}>
					{jugadores.map((jugador) => (
						<option key={jugador.id} value={jugador.id ?? 0}>
							{jugador.apodo || jugador.nombre}
						</option>
					))}
				</select>
			</div>
			<div className={styles.section}>
				<label className={styles.sectionLabel}>Pareja 2</label>
				<select
					className={styles.selectField}
					value={formData.id_jugador1_pareja2}
					onChange={(e) =>
						setFormData({
							...formData,
							id_jugador1_pareja2: parseInt(e.target.value),
						})
					}>
					{jugadores.map((jugador) => (
						<option key={jugador.id} value={jugador.id ?? 0}>
							{jugador.apodo || jugador.nombre}
						</option>
					))}
				</select>
				<select
					className={styles.selectField}
					value={formData.id_jugador2_pareja2}
					onChange={(e) =>
						setFormData({
							...formData,
							id_jugador2_pareja2: parseInt(e.target.value),
						})
					}>
					{jugadores.map((jugador) => (
						<option key={jugador.id} value={jugador.id ?? 0}>
							{jugador.apodo || jugador.nombre}
						</option>
					))}
				</select>
			</div>
			<InputField
				type='number'
				placeholder='ID Pista'
				value={formData.id_pista.toString()}
				onChange={(e) =>
					setFormData({ ...formData, id_pista: parseInt(e.target.value) || 1 })
				}
			/>
			<InputField
				type='number'
				placeholder='ID Estado'
				value={formData.id_estado.toString()}
				onChange={(e) =>
					setFormData({
						...formData,
						id_estado: parseInt(e.target.value) || 1,
					})
				}
			/>
			<div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
				<Button variant='success' onClick={handleSubmit}>
					{submitText}
				</Button>
				<Button variant='danger' onClick={closePopup}>
					Cancelar
				</Button>
			</div>
		</>
	);
}

export default PartidoForm;
