export type ClubFormData = Readonly<{
	nombre: string;
	ciudad: string;
}>;

export type ClubFormProps = Readonly<{
	onSubmit: (data: ClubFormData) => Promise<void>;
	initialData?: ClubFormData;
	submitText?: string;
}>;
