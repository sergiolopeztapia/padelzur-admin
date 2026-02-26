import styles from '@/styles/sidebar.module.css'

export function Sidebar () {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.logo}>🏸</div>
        <div className={styles['brand-text']}>
                            <h2>Padel Admin</h2>
                            <span>Dashboard</span>
        </div>
      </div>

      <nav className={styles.nav}>
        <ul>
          <li className={styles.active}>Clubes</li>
          <li>Reservas</li>
          <li>Usuarios</li>
          <li>Configuración</li>
        </ul>
      </nav>

      <div className={styles['sidebar-footer']}>
        <small>v0.1 • admin</small>
      </div>
    </aside>
  )
}
