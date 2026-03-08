import Button from '@/components/Button/Button';
import styles from './Popup.module.css';
import usePopupStore from '@/stores/usePopupStore';

function Popup() {
	const { isOpen, title, children, closePopup } = usePopupStore();

	if (!isOpen) return null;

	return (
		<div className={styles.container} onClick={closePopup}>
			<div className={styles.content} onClick={(e) => e.stopPropagation()}>
				<div className={styles.header}>
					{title ? <h3 className={styles.title}>{title}</h3> : <span />}
					<Button
						variant='secondary'
						size='sm'
						type='button'
						iconName='X'
						onClick={closePopup}
					/>
				</div>
				<div className={styles.body}>{children}</div>
			</div>
		</div>
	);
}

export default Popup;
