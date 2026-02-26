import type { ReactNode, ButtonHTMLAttributes } from 'react'
import type { LucideIcon } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import styles from '@/styles/dashboard.module.css'

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'edit' | 'logout'
type ButtonSize = 'default' | 'sm'
type IconPosition = 'left' | 'right'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children?: ReactNode
  fullWidth?: boolean
  iconName?: keyof typeof LucideIcons
  iconPosition?: IconPosition
  iconSize?: number
}

export function Button ({
  variant = 'primary',
  size = 'default',
  children,
  fullWidth = false,
  iconName,
  iconPosition = 'left',
  iconSize = 18,
  className = '',
  ...props
}: ButtonProps) {
  const variantClass = styles[`btn-${variant}`]
  const sizeClass = size === 'sm' ? styles['btn-sm'] : ''
  const Icon = iconName ? (LucideIcons[iconName] as LucideIcon | undefined) : undefined

  const classes = [
    styles.btn,
    variantClass,
    sizeClass,
    className
  ].filter(Boolean).join(' ')

  return (
    <button
      className={classes}
      style={{ width: fullWidth ? '100%' : undefined }}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon size={iconSize} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={iconSize} />}
    </button>
  )
}
