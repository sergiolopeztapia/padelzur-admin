import type { PistaSuperficie, PistaTipo } from '../hooks/usePistasPage.types';

export type PistaFormData = {
	nombre: string;
	superficie: PistaSuperficie;
	tipo: PistaTipo;
};

export type PistaFormProps = Readonly<{
	onSubmit: (data: PistaFormData) => Promise<void>;
	initialData?: PistaFormData;
	submitText?: string;
}>;
