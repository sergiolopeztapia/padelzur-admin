import { useState } from 'react';
import { Button } from '@/components/Button/Button';
import { InputField } from '@/components/InputField/InputField';
import usePopupStore from '@/stores/usePopupStore';

type AddClubFormProps = {
	onSubmit: (data: { nombre: string; ciudad: string }) => Promise<void>;
};

export function AddClubForm({ onSubmit }: AddClubFormProps) {
	const { closePopup } = usePopupStore();
	const [formData, setFormData] = useState({ nombre: '', ciudad: '' });

	const handleSubmit = async () => {
		if (!formData.nombre || !formData.ciudad) return;
		await onSubmit(formData);
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
					Guardar
				</Button>
				<Button variant='secondary' onClick={closePopup}>
					Cancelar
				</Button>
			</div>
		</>
	);
}
