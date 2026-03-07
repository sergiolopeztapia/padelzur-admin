import { useState } from 'react';
import { Button } from '@/components/Button/Button';
import { InputField } from '@/components/InputField/InputField';
import usePopupStore from '@/stores/usePopupStore';
import toast from 'react-hot-toast';

type ClubFormData = {
	nombre: string;
	ciudad: string;
};

type ClubFormProps = {
	onSubmit: (data: ClubFormData) => Promise<void>;
	initialData?: ClubFormData;
	submitText?: string;
};

export function ClubForm({
	onSubmit,
	initialData,
	submitText = 'Guardar',
}: ClubFormProps) {
	const { closePopup } = usePopupStore();
	const [formData, setFormData] = useState<ClubFormData>({
		nombre: initialData?.nombre ?? '',
		ciudad: initialData?.ciudad ?? '',
	});

	const handleSubmit = async () => {
		if (!formData.nombre || !formData.ciudad) return;
		try {
			await onSubmit(formData);
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : 'No se pudo guardar el club',
			);
		}
	};

	return (
		<>
			<div style={{ marginBottom: '1rem' }}>
				<InputField
					type='text'
					placeholder='Nombre del club'
					value={formData.nombre}
					onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
				/>
			</div>
			<div style={{ marginBottom: '1rem' }}>
				<InputField
					type='text'
					placeholder='Ciudad'
					value={formData.ciudad}
					onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
				/>
			</div>
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
