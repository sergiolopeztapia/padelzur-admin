import { Button } from '@/components/Button/Button';
import usePopupStore from '@/stores/usePopupStore';

type DeleteConfirmationProps = {
	itemName: string;
	onConfirm: () => Promise<void> | void;
};

export function DeleteConfirmation({
	itemName,
	onConfirm,
}: DeleteConfirmationProps) {
	const { closePopup } = usePopupStore();

	const handleConfirm = async () => {
		await onConfirm();
		closePopup();
	};

	return (
		<>
			<p>
				¿Estás seguro de que deseas eliminar el club <strong>{itemName}</strong>
				?
			</p>
			<div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
				<Button variant='danger' onClick={handleConfirm}>
					Eliminar
				</Button>
				<Button variant='secondary' onClick={closePopup}>
					Cancelar
				</Button>
			</div>
		</>
	);
}
