import './style.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { UsersPage } from './pages/UsersPage';
import { LoginPage } from './pages/LoginPage';

const sessionRaw =
	typeof window !== 'undefined'
		? sessionStorage.getItem('supabase_session')
		: null;
const isLogged = !!sessionRaw;

ReactDOM.createRoot(document.getElementById('app')!).render(
	<React.StrictMode>
		{isLogged ? <UsersPage /> : <LoginPage />}
	</React.StrictMode>,
);
