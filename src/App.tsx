import { Navigate, Route, Routes } from 'react-router-dom';
import { ResultadoView } from './views/Resultado/ResultadoView';
import { Toaster } from 'react-hot-toast';
import Admin from './features/Admin/Admin';
import Popup from '@/components/Popup/Popup';
import useSessionStore from '@/stores/useSessionStore';
import LoginPage from './pages/LoginPage/LoginPage';

function App() {
	const session = useSessionStore((state) => state.session);

	return (
		<>
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
		</>
	);
}

function ResultadoPreview() {
	return (
		// <LoginPage />
		<div className='resultadoCenter'>
			<ResultadoView
				eventLeft='Padelbrand'
				eventLeftNote='Mixing Gastronomico'
				roundRight='13 DIC 2026'
				roundRightNote='20:30h'
				photoUrl='/montepalma.png'
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
	);
}

export default App;
