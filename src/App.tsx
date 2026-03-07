import { Toaster } from 'react-hot-toast';
import ClubsPage from './pages/ClubsPage/ClubsPage';
import LoginPage from './pages/LoginPage/LoginPage';
import useSessionStore from '@/stores/useSessionStore';
import { Popup } from '@/components/Popup/Popup';
import Header from '@/features/Header/Header';

function App() {
	const session = useSessionStore((state) => state.session);

	return (
		<>
			{session ? (
				<>
					<Header />
					<ClubsPage />
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
