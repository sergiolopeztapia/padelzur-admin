import { useState } from 'react';
import Button from '@/components/Button/Button';
import InputField from '@/components/InputField/InputField';
import InputSelect from '@/components/InputSelect/InputSelect';
import usePopupStore from '@/stores/usePopupStore';
import toast from 'react-hot-toast';
import type { PistaFormData, PistaFormProps } from './PistaForm.types';
import { PistaSuperficie, PistaTipo } from '../hooks/usePistasPage.types';

function PistaForm({
	onSubmit,
	initialData,
	submitText = 'Guardar',
	clubs,
}: PistaFormProps) {
	const { closePopup } = usePopupStore();
	const firstClubId = clubs.find((club) => club.id != null)?.id ?? 0;

	const [formData, setFormData] = useState<PistaFormData>({
		id_club: initialData?.id_club ?? firstClubId,
		nombre: initialData?.nombre ?? '',
		superficie: initialData?.superficie ?? PistaSuperficie.AZUL,
		tipo: initialData?.tipo ?? PistaTipo.MURO,
	});

	const clubOptions = clubs
		.filter((club) => club.id != null)
		.map((club) => ({
			value: club.id ?? 0,
			label: `${club.nombre} (${club.ciudad})`,
		}));

	const superficieOptions = [
		{ value: PistaSuperficie.ROJO, label: PistaSuperficie.ROJO },
		{ value: PistaSuperficie.AZUL, label: PistaSuperficie.AZUL },
		{ value: PistaSuperficie.VERDE, label: PistaSuperficie.VERDE },
	];

	const tipoOptions = [
		{ value: PistaTipo.MURO, label: PistaTipo.MURO },
		{ value: PistaTipo.CRISTAL, label: PistaTipo.CRISTAL },
	];

	const handleSubmit = async () => {
		if (!formData.id_club) {
			toast.error('El club es requerido');
			return;
		}

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
			<InputSelect
				options={clubOptions}
				value={clubOptions.length > 0 ? formData.id_club : ''}
				onChange={(e) =>
					setFormData({
						...formData,
						id_club: parseInt(e.target.value, 10),
					})
				}
				placeholder='Selecciona club (ciudad)'
				disabled={clubOptions.length === 0}
				required
			/>
			<InputField
				type='text'
				placeholder='Nombre de la pista'
				value={formData.nombre}
				onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
			/>
			<InputSelect
				options={superficieOptions}
				value={formData.superficie}
				onChange={(e) =>
					setFormData({
						...formData,
						superficie: e.target.value as PistaFormData['superficie'],
					})
				}
			/>
			<InputSelect
				options={tipoOptions}
				value={formData.tipo}
				onChange={(e) =>
					setFormData({
						...formData,
						tipo: e.target.value as PistaFormData['tipo'],
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

export default PistaForm;
