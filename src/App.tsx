import { Toaster } from 'react-hot-toast';
import { ClubsDashboard } from './components/ClubsDashboard/ClubsDashboard';
import { LoginPage } from './pages/LoginPage';
import useSessionStore from '@/stores/useSessionStore';

function App() {
	const session = useSessionStore((state) => state.session);

	console.log('Session en App:', session); // Debug: Verificar el valor de session en App

	return (
		<>
			{session ? <ClubsDashboard /> : <LoginPage />}
			<Toaster />
		</>
	);
}

export default App;
