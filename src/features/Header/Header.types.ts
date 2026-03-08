export type HeaderSection = 'clubs' | 'jugadores';

export type HeaderProps = Readonly<{
	activeSection: HeaderSection;
	onSectionChange: (section: HeaderSection) => void;
}>;

export type UseHeaderResult = Readonly<{
	onLogout: () => Promise<void>;
}>;
