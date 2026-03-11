import { useState } from 'react';
import Header from '@/features/Header/Header';
import type { HeaderSection } from '@/features/Header/Header.types';
import ClubsPage from '../../pages/ClubsPage/ClubsPage';
import JugadoresPage from '../../pages/JugadoresPage/JugadoresPage';
import PistasPage from '../../pages/PistasPage/PistasPage';
import PartidosPage from '../../pages/PartidosPage/PartidosPage';

function Admin() {
	const [section, setSection] = useState<HeaderSection>('clubs');

	return (
		<>
			<Header activeSection={section} onSectionChange={setSection} />
			{section === 'clubs' && <ClubsPage />}
			{section === 'jugadores' && <JugadoresPage />}
			{section === 'pistas' && <PistasPage />}
			{section === 'partidos' && <PartidosPage />}
		</>
	);
}

export default Admin;
