import { useEffect, useState } from 'react'

export function useTheme() {
  const [theme, setThemeState] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    // Obtener el tema guardado en localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    
    // Determinar el tema inicial
    let initialTheme: 'light' | 'dark'
    if (savedTheme) {
      initialTheme = savedTheme
    } else {
      // Usar la preferencia del sistema
      initialTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    
    setThemeState(initialTheme)
    applyTheme(initialTheme)
  }, [])

  const applyTheme = (newTheme: 'light' | 'dark') => {
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setThemeState(newTheme)
    applyTheme(newTheme)
  }

  return { theme, toggleTheme }
}
