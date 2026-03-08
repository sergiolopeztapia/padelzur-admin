import { useState } from 'react';
import Button from '@/components/Button/Button';
import InputField from '@/components/InputField/InputField';
import usePopupStore from '@/stores/usePopupStore';
import toast from 'react-hot-toast';
import type { PistaFormData, PistaFormProps } from './PistaForm.types';
import { PistaSuperficie, PistaTipo } from '../hooks/usePistasPage.types';
import styles from './PistaForm.module.css';

function PistaForm({
	onSubmit,
	initialData,
	submitText = 'Guardar',
}: PistaFormProps) {
	const { closePopup } = usePopupStore();
	const [formData, setFormData] = useState<PistaFormData>({
		nombre: initialData?.nombre ?? '',
		superficie: initialData?.superficie ?? PistaSuperficie.AZUL,
		tipo: initialData?.tipo ?? PistaTipo.MURO,
	});

	const handleSubmit = async () => {
		if (!formData.nombre) {
			toast.error('El nombre es requerido');
			return;
		}

		try {
			await onSubmit(formData);
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : 'No se pudo guardar la pista',
			);
		}
	};

	return (
		<>
			<InputField
				type='text'
				placeholder='Nombre de la pista'
				value={formData.nombre}
				onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
			/>
			<select
				className={styles.selectField}
				value={formData.superficie}
				onChange={(e) =>
					setFormData({
						...formData,
						superficie: e.target.value as PistaFormData['superficie'],
					})
				}>
				<option value={PistaSuperficie.ROJO}>{PistaSuperficie.ROJO}</option>
				<option value={PistaSuperficie.AZUL}>{PistaSuperficie.AZUL}</option>
				<option value={PistaSuperficie.VERDE}>{PistaSuperficie.VERDE}</option>
			</select>
			<select
				className={styles.selectField}
				value={formData.tipo}
				onChange={(e) =>
					setFormData({
						...formData,
						tipo: e.target.value as PistaFormData['tipo'],
					})
				}>
				<option value={PistaTipo.MURO}>{PistaTipo.MURO}</option>
				<option value={PistaTipo.CRISTAL}>{PistaTipo.CRISTAL}</option>
			</select>
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

export default PistaForm;
