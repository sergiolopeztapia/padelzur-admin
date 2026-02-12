import { useState } from 'react'
import { supabase } from '../lib/supabase'
import styles from '../styles/dashboard.module.css'
import type { SupabaseSession } from '../types/Session'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      // The supabase client returns session object inside `data` (may contain session and user)
      const session = (data as any)?.session || data

      if (session) {
        const saved: SupabaseSession = {
          access_token: session.access_token,
          expires_at: session.expires_at,
          refresh_token: session.refresh_token,
          provider_token: session.provider_token,
          user: session.user,
        }

        sessionStorage.setItem('supabase_session', JSON.stringify(saved))
        // reload to pick up changes or redirect
        window.location.href = '/'
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles['dashboard-container']}>
      <div className={styles.card} style={{ maxWidth: 520, margin: '40px auto' }}>
        <h2 style={{ marginTop: 0 }}>Iniciar sesión</h2>
        <p style={{ color: 'var(--muted)' }}>Usa tus credenciales de Supabase para entrar</p>

        <form onSubmit={handleLogin} style={{ marginTop: 16 }}>
          <div style={{ marginBottom: 12 }}>
            <input
              className={styles['form-input']}
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <input
              className={styles['form-input']}
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className={styles['form-actions']}>
            <button className={`${styles.btn} ${styles['btn-primary']}`} type="submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
            <button type="button" className={`${styles.btn} ${styles['btn-secondary']}`} onClick={() => { setEmail('test@example.com'); setPassword('password') }}>
              Autocompletar
            </button>
          </div>

          {error && <div style={{ color: '#ffb4b4', marginTop: 12 }}>{error}</div>}
        </form>
      </div>
    </div>
  )
}
