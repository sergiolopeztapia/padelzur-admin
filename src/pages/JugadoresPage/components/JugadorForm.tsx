import { useState } from 'react';
import Button from '@/components/Button/Button';
import InputField from '@/components/InputField/InputField';
import Calendario from '@/components/Calendario/Calendario';
import usePopupStore from '@/stores/usePopupStore';
import toast from 'react-hot-toast';
import type { JugadorFormData, JugadorFormProps } from './JugadorForm.types';
import { JugadorLado, JugadorSexo } from '../hooks/useJugadoresPage.types';
import styles from './JugadorForm.module.css';

function JugadorForm({
	onSubmit,
	initialData,
	submitText = 'Guardar',
}: JugadorFormProps) {
	const { closePopup } = usePopupStore();
	const [formData, setFormData] = useState<JugadorFormData>({
		nombre: initialData?.nombre ?? '',
		apodo: initialData?.apodo ?? '',
		telefono: initialData?.telefono ?? '',
		apellido1: initialData?.apellido1 ?? '',
		apellido2: initialData?.apellido2 ?? '',
		fecha_nac: initialData?.fecha_nac ?? '',
		lado: initialData?.lado ?? JugadorLado.DRIVE,
		sexo: initialData?.sexo ?? JugadorSexo.H,
	});

	const handleSubmit = async () => {
		if (
			!formData.nombre ||
			!formData.apodo ||
			!formData.telefono ||
			!formData.apellido1 ||
			!formData.fecha_nac
		) {
			return;
		}

		try {
			await onSubmit(formData);
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: 'No se pudo guardar el jugador',
			);
		}
	};

	return (
		<>
			<InputField
				type='text'
				placeholder='Apodo'
				value={formData.apodo}
				onChange={(e) => setFormData({ ...formData, apodo: e.target.value })}
			/>
			<InputField
				type='text'
				placeholder='Nombre'
				value={formData.nombre}
				onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
			/>
			<InputField
				type='tel'
				placeholder='Telefono'
				value={formData.telefono}
				onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
			/>
			<InputField
				type='text'
				placeholder='Primer apellido'
				value={formData.apellido1}
				onChange={(e) =>
					setFormData({ ...formData, apellido1: e.target.value })
				}
			/>
			<InputField
				type='text'
				placeholder='Segundo apellido (opcional)'
				value={formData.apellido2}
				onChange={(e) =>
					setFormData({ ...formData, apellido2: e.target.value })
				}
			/>
			<Calendario
				value={formData.fecha_nac}
				onChange={(e) =>
					setFormData({ ...formData, fecha_nac: e.target.value })
				}
			/>
			<select
				className={styles.selectField}
				value={formData.lado}
				onChange={(e) =>
					setFormData({
						...formData,
						lado: e.target.value as JugadorFormData['lado'],
					})
				}>
				<option value={JugadorLado.DRIVE}>{JugadorLado.DRIVE}</option>
				<option value={JugadorLado.REVES}>{JugadorLado.REVES}</option>
				<option value={JugadorLado.AMBOS}>{JugadorLado.AMBOS}</option>
			</select>
			<select
				className={styles.selectField}
				value={formData.sexo}
				onChange={(e) =>
					setFormData({
						...formData,
						sexo: e.target.value as JugadorFormData['sexo'],
					})
				}>
				<option value={JugadorSexo.H}>{JugadorSexo.H}</option>
				<option value={JugadorSexo.M}>{JugadorSexo.M}</option>
			</select>
			<div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
				<Button variant='success' onClick={handleSubmit}>
					{submitText}
				</Button>
				<Button variant='secondary' onClick={closePopup}>
					Cancelar
				</Button>
			</div>
		</>
	);
}

export default JugadorForm;
