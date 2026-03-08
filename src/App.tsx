import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import ClubsPage from './pages/ClubsPage/ClubsPage';
import JugadoresPage from './pages/JugadoresPage/JugadoresPage';
import LoginPage from './pages/LoginPage/LoginPage';
import useSessionStore from '@/stores/useSessionStore';
import Popup from '@/components/Popup/Popup';
import Header from '@/features/Header/Header';
import type { HeaderSection } from '@/features/Header/Header.types';

function App() {
	const session = useSessionStore((state) => state.session);
	const [section, setSection] = useState<HeaderSection>('clubs');

	return (
		<>
			{session ? (
				<>
					<Header activeSection={section} onSectionChange={setSection} />
					{section === 'clubs' ? <ClubsPage /> : <JugadoresPage />}
				</>
			) : (
				<LoginPage />
			)}
			<Toaster />
			<Popup />
		</>
	);
}

export default App;
