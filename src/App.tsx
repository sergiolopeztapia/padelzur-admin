import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ResultadoView } from './views/Resultado/ResultadoView';
import { supabase } from '@/lib/supabase';
import { Toaster } from 'react-hot-toast';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import Admin from './features/Admin/Admin';
import Popup from '@/components/Popup/Popup';
import useSessionStore from '@/stores/useSessionStore';
import LoginPage from './pages/LoginPage/LoginPage';
import styles from './App.module.css';
import type {
	Partido,
	PartidoResultado,
} from './pages/PartidosPage/hooks/usePartidosPage.types';

dayjs.locale('es');

function App() {
	const session = useSessionStore((state) => state.session);

	return (
		<div className={styles.appLayout}>
			<Routes>
				<Route
					path='/'
					element={<Navigate to={session ? '/admin' : '/login'} replace />}
				/>
				<Route path='/resultado/partido/:id' element={<ResultadoPreview />} />
				<Route
					path='/login'
					element={session ? <Navigate to='/admin' replace /> : <LoginPage />}
				/>
				<Route
					path='/admin'
					element={session ? <Admin /> : <Navigate to='/login' replace />}
				/>
				<Route
					path='*'
					element={<Navigate to='/resultado/partido' replace />}
				/>
			</Routes>
			<Toaster />
			<Popup />
		</div>
	);
}

function ResultadoPreview() {
	const { id } = useParams<{ id: string }>();
	const partidoId = Number(id);

	const [partido, setPartido] = useState<Partido | null>(null);
	const [resultado, setResultado] = useState<PartidoResultado | null>(null);
	const [clubNombre, setClubNombre] = useState<string>('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!partidoId) return;

		Promise.all([
			supabase.from('partidos').select('*').eq('id', partidoId).single(),
			supabase
				.from('partidos_resultados')
				.select('*')
				.eq('id_partido', partidoId)
				.maybeSingle(),
		]).then(async ([{ data: p }, { data: r }]) => {
			setPartido(p as Partido | null);
			setResultado(r as PartidoResultado | null);

			if (p?.id_pista) {
				const { data: pista } = await supabase
					.from('pistas')
					.select('id_club')
					.eq('id', p.id_pista)
					.single();

				if (pista?.id_club) {
					const { data: club } = await supabase
						.from('clubes')
						.select('nombre')
						.eq('id', pista.id_club)
						.single();

					setClubNombre((club?.nombre as string | null) ?? '');
				}
			}

			setLoading(false);
		});
	}, [partidoId]);

	if (!id || Number.isNaN(partidoId)) {
		return <div>ID de partido no válido.</div>;
	}

	if (loading) {
		return <div>Cargando...</div>;
	}

	if (!partido) {
		return <div>Partido no encontrado.</div>;
	}

	const buildScore = (
		s1?: number | null,
		s2?: number | null,
		s3?: number | null,
	) => [s1, s2, s3].filter((v) => v != null).join(' ');

	return (
		<div className='resultadoCenter'>
			<ResultadoView
				eventLeft={clubNombre}
				roundRight={
					partido.fecha ? dayjs(partido.fecha).format('D MMM YYYY') : ''
				}
				roundRightNote={
					partido.fecha ? dayjs(partido.fecha).format('HH:mm') + 'h' : ''
				}
				teamA={{
					player1: partido.id_jugador1_pareja1,
					player2: partido.id_jugador2_pareja1,
					score: buildScore(
						resultado?.pareja1_set1,
						resultado?.pareja1_set2,
						resultado?.pareja1_set3,
					),
				}}
				teamB={{
					player1: partido.id_jugador1_pareja2,
					player2: partido.id_jugador2_pareja2,
					score: buildScore(
						resultado?.pareja2_set1,
						resultado?.pareja2_set2,
						resultado?.pareja2_set3,
					),
				}}
			/>
		</div>
	);
}

export default App;
