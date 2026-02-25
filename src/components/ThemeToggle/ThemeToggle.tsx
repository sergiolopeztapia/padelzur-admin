import { useTheme } from '@/hooks/useTheme'
import { Button } from '@/components/Button/Button'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="secondary"
      onClick={toggleTheme}
      title={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
      iconName={theme === 'light' ? 'Moon' : 'Sun'}
      aria-label={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
    >
      {theme === 'light' ? 'Oscuro' : 'Claro'}
    </Button>
  )
}
