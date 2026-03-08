import Button from '@/components/Button/Button';
import toast from 'react-hot-toast';
import type { ConfirmActionProps } from './ConfirmAction.types';

function ConfirmAction({
	message,
	onConfirm,
	onCancel,
	confirmText = 'Confirmar',
	cancelText = 'Cancelar',
}: ConfirmActionProps) {
	const handleConfirm = async () => {
		try {
			await onConfirm();
			onCancel();
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: 'No se pudo completar la acción',
			);
		}
	};

	return (
		<>
			<p>{message}</p>
			<div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
				<Button variant='danger' onClick={handleConfirm}>
					{confirmText}
				</Button>
				<Button variant='secondary' onClick={onCancel}>
					{cancelText}
				</Button>
			</div>
		</>
	);
}

export default ConfirmAction;
