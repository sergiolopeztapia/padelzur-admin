import { useEffect } from 'react';
import JugadorForm from '../components/JugadorForm';
import ConfirmAction from '@/components/Confirmation/ConfirmAction';
import { useSupabase } from '@/hooks/useSupabase';
import usePopupStore from '@/stores/usePopupStore';
import toast from 'react-hot-toast';
import {
	JugadorSexo,
	type Jugador,
	type UseJugadoresPageResult,
} from './useJugadoresPage.types';
import type { JugadorFormData } from '../components/JugadorForm.types';

export default function useJugadoresPage(): UseJugadoresPageResult {
	const {
		data,
		loading,
		error,
		fetchData,
		insert,
		update,
		delete: deleteJugador,
	} = useSupabase<Jugador>({
		table: 'jugadores',
	});

	const { openPopup, closePopup } = usePopupStore();

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const toFormLado = (lado: Jugador['lado']): JugadorFormData['lado'] => lado;

	const mapFormDataToJugador = (formData: JugadorFormData) => ({
		nombre: formData.nombre,
		apodo: formData.apodo,
		telefono: formData.telefono,
		apellido1: formData.apellido1,
		apellido2: formData.apellido2.trim() || null,
		fecha_nac: formData.fecha_nac,
		lado: formData.lado,
		sexo: formData.sexo,
	});

	const handleAddJugador = async (formData: JugadorFormData) => {
		try {
			await insert([mapFormDataToJugador(formData)]);
			closePopup();
			fetchData();
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : 'Error al crear jugador',
			);
		}
	};

	const handleEditJugador = async (
		jugadorId: number,
		formData: JugadorFormData,
	) => {
		try {
			await update(jugadorId, mapFormDataToJugador(formData));
			closePopup();
			fetchData();
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : 'Error al editar jugador',
			);
		}
	};

	const onAddJugador = () => {
		openPopup({
			title: 'Nuevo Jugador',
			children: <JugadorForm onSubmit={handleAddJugador} />,
		});
	};

	const onEditJugador = (jugador: Jugador) => {
		if (jugador.id == null) return;
		const jugadorId = jugador.id;

		openPopup({
			title: 'Editar Jugador',
			children: (
				<JugadorForm
					initialData={{
						nombre: jugador.nombre,
						apodo: jugador.apodo,
						telefono: jugador.telefono,
						apellido1: jugador.apellido1,
						apellido2: jugador.apellido2 ?? '',
						fecha_nac: jugador.fecha_nac,
						lado: toFormLado(jugador.lado),
						sexo:
							jugador.sexo === JugadorSexo.M ? JugadorSexo.M : JugadorSexo.H,
					}}
					onSubmit={async (formData) => handleEditJugador(jugadorId, formData)}
				/>
			),
		});
	};

	const onDeleteJugador = (jugador: Jugador) => {
		const { id, nombre, apodo } = jugador;

		const confirmDeleteJugador = async () => {
			if (id == null) return;
			try {
				await deleteJugador(id);
				fetchData();
			} catch (error) {
				toast.error(
					error instanceof Error ? error.message : 'Error al eliminar jugador',
				);
			}
		};

		openPopup({
			title: 'Confirmar eliminacion',
			children: (
				<ConfirmAction
					message={
						<>
							Estas seguro de que deseas eliminar al jugador{' '}
							<strong>{`${nombre} (${apodo})`}</strong>?
						</>
					}
					confirmText='Eliminar'
					onConfirm={confirmDeleteJugador}
					onCancel={closePopup}
				/>
			),
		});
	};

	return {
		jugadores: data ?? [],
		loading,
		error,
		onAddJugador,
		onEditJugador,
		onDeleteJugador,
	};
}
