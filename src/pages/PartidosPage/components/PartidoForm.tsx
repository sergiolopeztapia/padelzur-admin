import { useState } from 'react';
import Button from '@/components/Button/Button';
import Calendario from '@/components/Calendario/Calendario';
import InputSelect from '@/components/InputSelect/InputSelect';
import usePopupStore from '@/stores/usePopupStore';
import toast from 'react-hot-toast';
import type { PartidoFormData, PartidoFormProps } from './PartidoForm.types';
import styles from './PartidoForm.module.css';

const toDateTimeLocalValue = (value?: string | null): string => {
	if (!value) return '';
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return '';

	const pad = (num: number) => String(num).padStart(2, '0');
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

function PartidoForm({
	onSubmit,
	initialData,
	submitText = 'Guardar',
	jugadores,
	pistas,
	estados,
	getPistaLabel,
}: PartidoFormProps) {
	const { closePopup } = usePopupStore();
	const firstPistaId = pistas.find((pista) => pista.id != null)?.id ?? 1;
	const firstEstadoId = estados.find((estado) => estado.id != null)?.id ?? 1;

	const [formData, setFormData] = useState<PartidoFormData>({
		id_jugador1_pareja1: initialData?.id_jugador1_pareja1 ?? 1,
		id_jugador2_pareja1: initialData?.id_jugador2_pareja1 ?? 1,
		id_jugador1_pareja2: initialData?.id_jugador1_pareja2 ?? 1,
		id_jugador2_pareja2: initialData?.id_jugador2_pareja2 ?? 1,
		id_pista: initialData?.id_pista ?? firstPistaId,
		id_estado: initialData?.id_estado ?? firstEstadoId,
		fecha: toDateTimeLocalValue(initialData?.fecha),
	});

	const jugadorOptions = jugadores.map((jugador) => ({
		value: jugador.id ?? 0,
		label: jugador.apodo || jugador.nombre,
	}));

	const pistaOptions = pistas
		.filter((pista) => pista.id != null)
		.map((pista) => ({
			value: pista.id ?? 0,
			label: getPistaLabel(pista.id ?? 0),
		}));

	const estadoOptions = estados
		.filter((estado) => estado.id != null)
		.map((estado) => {
			const baseLabel =
				typeof estado.nombre === 'string' && estado.nombre.trim().length > 0
					? estado.nombre
					: typeof estado.descripcion === 'string' &&
						  estado.descripcion.trim().length > 0
						? estado.descripcion
						: null;

			return {
				value: estado.id ?? 0,
				label: baseLabel ?? `Estado #${estado.id}`,
			};
		});

	const handleSubmit = async () => {
		if (
			!formData.id_jugador1_pareja1 ||
			!formData.id_jugador2_pareja1 ||
			!formData.id_jugador1_pareja2 ||
			!formData.id_jugador2_pareja2 ||
			!formData.id_pista ||
			!formData.id_estado ||
			!formData.fecha
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
				<InputSelect
					options={jugadorOptions}
					value={formData.id_jugador1_pareja1}
					onChange={(e) =>
						setFormData({
							...formData,
							id_jugador1_pareja1: parseInt(e.target.value, 10),
						})
					}
				/>
				<InputSelect
					options={jugadorOptions}
					value={formData.id_jugador2_pareja1}
					onChange={(e) =>
						setFormData({
							...formData,
							id_jugador2_pareja1: parseInt(e.target.value, 10),
						})
					}
				/>
			</div>
			<div className={styles.section}>
				<label className={styles.sectionLabel}>Pareja 2</label>
				<InputSelect
					options={jugadorOptions}
					value={formData.id_jugador1_pareja2}
					onChange={(e) =>
						setFormData({
							...formData,
							id_jugador1_pareja2: parseInt(e.target.value, 10),
						})
					}
				/>
				<InputSelect
					options={jugadorOptions}
					value={formData.id_jugador2_pareja2}
					onChange={(e) =>
						setFormData({
							...formData,
							id_jugador2_pareja2: parseInt(e.target.value, 10),
						})
					}
				/>
			</div>
			<InputSelect
				options={pistaOptions}
				value={formData.id_pista}
				onChange={(e) =>
					setFormData({
						...formData,
						id_pista: parseInt(e.target.value, 10),
					})
				}
				placeholder='Selecciona pista'
				required
			/>
			<InputSelect
				options={estadoOptions}
				value={formData.id_estado}
				onChange={(e) =>
					setFormData({
						...formData,
						id_estado: parseInt(e.target.value, 10),
					})
				}
				placeholder='Selecciona estado'
				required
			/>
			<Calendario
				type='datetime-local'
				value={formData.fecha}
				onChange={(e) =>
					setFormData({
						...formData,
						fecha: e.target.value,
					})
				}
				name='fecha-partido'
				required
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
