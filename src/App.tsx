import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import ClubsPage from './pages/ClubsPage/ClubsPage';
import JugadoresPage from './pages/JugadoresPage/JugadoresPage';
import PistasPage from './pages/PistasPage/PistasPage';
import PartidosPage from './pages/PartidosPage/PartidosPage';
// import LoginPage from './pages/LoginPage/LoginPage';
import useSessionStore from '@/stores/useSessionStore';
import Popup from '@/components/Popup/Popup';
import Header from '@/features/Header/Header';
import type { HeaderSection } from '@/features/Header/Header.types';
import { ResultadoView } from './views/Resultado/ResultadoView';

function App() {
	const session = useSessionStore((state) => state.session);
	const [section, setSection] = useState<HeaderSection>('clubs');

	return (
		<>
			{session ? (
				<>
					<Header activeSection={section} onSectionChange={setSection} />
					{section === 'clubs' && <ClubsPage />}
					{section === 'jugadores' && <JugadoresPage />}
					{section === 'pistas' && <PistasPage />}
					{section === 'partidos' && <PartidosPage />}
				</>
			) : (
				// <LoginPage />
				<div className='resultadoCenter'>
					<ResultadoView
						eventLeft='Montepalma'
						roundRight='3 Mar 2026'
						photoUrl='/equipoA.jpg'
						teamA={{
							player1: 'Tapia',
							player2: 'Thanos',
							score: '6 3 6',
						}}
						teamB={{
							player1: 'Berguices',
							player2: 'Baron',
							score: '4 6 5',
						}}
					/>
				</div>
			)}
			<Toaster />
			<Popup />
		</>
	);
}

export default App;
