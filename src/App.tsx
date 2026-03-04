import { Toaster } from 'react-hot-toast';
import ClubsPage from './pages/ClubsPage/ClubsPage';
import LoginPage from './pages/LoginPage/LoginPage';
import useSessionStore from '@/stores/useSessionStore';

function App() {
	const session = useSessionStore((state) => state.session);

	return (
		<>
			{session ? <ClubsPage /> : <LoginPage />}
			<Toaster />
		</>
	);
}

export default App;
