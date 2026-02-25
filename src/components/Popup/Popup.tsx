import type { ReactNode } from 'react'
import { Button } from '@/components/Button/Button'
import styles from '@/styles/dashboard.module.css'

interface PopupProps {
  isOpen: boolean
  title?: string
  onClose: () => void
  children: ReactNode
}

export function Popup({ isOpen, title, onClose, children }: PopupProps) {
  if (!isOpen) return null

  return (
    <div className={styles['popup-overlay']} onClick={onClose}>
      <div className={styles['popup-content']} onClick={(e) => e.stopPropagation()}>
        <div className={styles['popup-header']}>
          {title ? <h3 className={styles['popup-title']}>{title}</h3> : <span />}
          <Button variant="secondary" size="sm" type="button" onClick={onClose}>
            Cerrar
          </Button>
        </div>
        <div className={styles['popup-body']}>
          {children}
        </div>
      </div>
    </div>
  )
}
