import { Navigate, Route, Routes } from 'react-router-dom';
import { ResultadoView } from './views/Resultado/ResultadoView';
import { Toaster } from 'react-hot-toast';
import Admin from './features/Admin/Admin';
import Popup from '@/components/Popup/Popup';
import useSessionStore from '@/stores/useSessionStore';
import LoginPage from './pages/LoginPage/LoginPage';
import styles from './App.module.css';

function App() {
	const session = useSessionStore((state) => state.session);

	return (
		<div className={styles.appLayout}>
			<Routes>
				<Route
					path='/'
					element={<Navigate to={session ? '/admin' : '/login'} replace />}
				/>
				<Route path='/ver' element={<ResultadoPreview />} />
				<Route
					path='/login'
					element={session ? <Navigate to='/admin' replace /> : <LoginPage />}
				/>
				<Route
					path='/admin'
					element={session ? <Admin /> : <Navigate to='/login' replace />}
				/>
				<Route path='*' element={<Navigate to='/ver' replace />} />
			</Routes>
			<Toaster />
			<Popup />
		</div>
	);
}

function ResultadoPreview() {
	return (
		// <LoginPage />
		<div className='resultadoCenter'>
			<ResultadoView
				eventLeft='Padelbrand'
				eventLeftNote='Partido de exhibición'
				roundRight='12 Mar 2026'
				roundRightNote='9:30h'
				photoUrl='/montepalma.png'
				teamA={{
					player1: 'Antonio Valverde',
					player2: 'Jaku',
					score: '6 6',
				}}
				teamB={{
					player1: 'Rafa España',
					player2: 'Baron',
					score: '4 3',
				}}
			/>
		</div>
	);
}

export default App;
