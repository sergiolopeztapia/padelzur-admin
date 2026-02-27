import ReactDOM from 'react-dom/client';
import { ClubsDashboard } from './components/ClubsDashboard/ClubsDashboard';
import { LoginPage } from './pages/LoginPage';
import useSessionStore from '@/stores/useSessionStore';
import './style.css';

function App() {
	const session = useSessionStore((state) => state.session);

	console.log('Session en App:', session); // Debug: Verificar el valor de session en App

	return <>{session ? <ClubsDashboard /> : <LoginPage />}</>;
}

ReactDOM.createRoot(document.getElementById('app')!).render(<App />);
