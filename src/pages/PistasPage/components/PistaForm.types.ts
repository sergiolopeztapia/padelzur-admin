import type { PistaSuperficie, PistaTipo } from '../hooks/usePistasPage.types';
import type { Club } from '../../ClubsPage/hooks/useClubsPage.types';

export type PistaFormData = {
	id_club: number;
	nombre: string;
	superficie: PistaSuperficie;
	tipo: PistaTipo;
};

export type PistaFormProps = Readonly<{
	onSubmit: (data: PistaFormData) => Promise<void>;
	initialData?: PistaFormData;
	submitText?: string;
	clubs: Club[];
}>;
