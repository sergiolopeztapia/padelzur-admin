export type Club = Readonly<{
	id: number | null; // Permitir null para nuevos registros sin ID asignado
	nombre: string;
	ciudad: string;
}>;
