export type HeaderProps = Readonly<{
	onLogout: () => void | Promise<void>;
}>;

export type UseHeaderResult = Readonly<{
	onLogout: () => Promise<void>;
}>;
