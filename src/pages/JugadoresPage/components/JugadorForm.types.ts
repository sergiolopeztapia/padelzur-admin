import { JugadorLado, JugadorSexo } from '../hooks/useJugadoresPage.types';

export type JugadorFormLado =
	| JugadorLado.DRIVE
	| JugadorLado.REVES
	| JugadorLado.AMBOS;
export type JugadorFormSexo = JugadorSexo.H | JugadorSexo.M;

export type JugadorFormData = Readonly<{
	nombre: string;
	apodo: string;
	telefono: string;
	apellido1: string;
	apellido2: string;
	fecha_nac: string;
	lado: JugadorFormLado;
	sexo: JugadorFormSexo;
}>;

export type JugadorFormProps = Readonly<{
	onSubmit: (data: JugadorFormData) => Promise<void>;
	initialData?: JugadorFormData;
	submitText?: string;
}>;
