import { Button } from '@/components/Button/Button';
import { InputField } from '@/components/InputField/InputField';
import { Lock, Mail } from 'lucide-react';
import styles from './LoginForm.module.css';
import toast from 'react-hot-toast';
import useLoginForm from './hooks/useLoginForm';

function LoginForm() {
	const {
		email,
		password,
		loading,
		error,
		onEmailChange,
		onPasswordChange,
		onSubmit,
		onAutofill,
	} = useLoginForm();

	if (error) toast.error(error, { position: 'bottom-left' });

	return (
		<form onSubmit={onSubmit}>
			<div className={styles.input}>
				<InputField
					type='email'
					placeholder='email@example.com'
					value={email}
					onChange={(e) => onEmailChange(e.target.value)}
					leftIcon={<Mail size={18} />}
				/>
			</div>

			<div className={styles.input}>
				<InputField
					type='password'
					placeholder='Contraseña'
					value={password}
					onChange={(e) => onPasswordChange(e.target.value)}
					leftIcon={<Lock size={18} />}
				/>
			</div>

			<div className={styles.actions}>
				<Button variant='primary' type='submit' disabled={loading}>
					{loading ? 'Entrando...' : 'Entrar'}
				</Button>
				<Button variant='secondary' iconName='CopyCheck' onClick={onAutofill} />
			</div>
		</form>
	);
}

export default LoginForm;
