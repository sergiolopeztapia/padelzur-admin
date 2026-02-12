import { useEffect, useState } from 'react'
import { useSupabase } from '../hooks/useSupabase'
import type { Clubes } from '../types/Clubes'
import styles from '../styles/dashboard.module.css'
import { Sidebar } from './Sidebar'

export function ClubsDashboard() {
  const { data: clubes, loading, error, fetchData, insert, update, delete: deleteClub } = useSupabase<Clubes>({
    table: 'clubes',
  })

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingData, setEditingData] = useState<Partial<Clubes>>({})
  const [newClub, setNewClub] = useState({ nombre: '', ciudad: '' })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleAddClub = async () => {
    if (!newClub.nombre || !newClub.ciudad) return
    await insert([
      {
        id: 0,
        nombre: newClub.nombre,
        ciudad: newClub.ciudad,
      },
    ])
    setNewClub({ nombre: '', ciudad: '' })
    setShowForm(false)
    fetchData()
  }

  const startEditing = (club: Clubes) => {
    setEditingId(club.id)
    setEditingData(club)
  }

  const handleUpdateClub = async () => {
    if (editingId && editingData.nombre && editingData.ciudad) {
      await update(editingId, { nombre: editingData.nombre, ciudad: editingData.ciudad })
      setEditingId(null)
      setEditingData({})
      fetchData()
    }
  }

  const handleDeleteClub = async (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este club?')) {
      await deleteClub(id)
      fetchData()
    }
  }

  if (loading) {
    return <div className={styles['dashboard-container']}><div className={styles.loading}>Cargando clubes...</div></div>
  }

  if (error) {
    return <div className={styles['dashboard-container']}><div className={styles.error}>Error: {error.message}</div></div>
  }

  return (
    <div className={styles['dashboard-container']}>
      <header className={styles['dashboard-header']}>
        <h1>🏸 Gestión de Clubes</h1>
        <p className={styles.subtitle}>Administra todos tus clubes de pádel</p>
      </header>

      <div className={styles['dashboard-main']}>
        <Sidebar />
        <div className={styles['dashboard-content']}>
          <div className={styles['action-bar']}>
            <button
              className={`${styles.btn} ${styles['btn-primary']}`}
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? '✕ Cancelar' : '+ Agregar Club'}
            </button>
          </div>

          {showForm && (
            <div className={styles['form-card']}>
              <h3>Nuevo Club</h3>
              <div className={styles['form-group']}>
                <input
                  type="text"
                  placeholder="Nombre del club"
                  value={newClub.nombre}
                  onChange={(e) => setNewClub({ ...newClub, nombre: e.target.value })}
                  className={styles['form-input']}
                />
              </div>
              <div className={styles['form-group']}>
                <input
                  type="text"
                  placeholder="Ciudad"
                  value={newClub.ciudad}
                  onChange={(e) => setNewClub({ ...newClub, ciudad: e.target.value })}
                  className={styles['form-input']}
                />
              </div>
              <div className={styles['form-actions']}>
                <button className={`${styles.btn} ${styles['btn-success']}`} onClick={handleAddClub}>
                  Guardar
                </button>
                <button className={`${styles.btn} ${styles['btn-secondary']}`} onClick={() => setShowForm(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          )}

          <div className={styles['clubs-grid']}>
            {clubes && clubes.length > 0 ? (
              clubes.map((club) => (
                <div key={club.id} className={styles['club-card']}>
                  {editingId === club.id ? (
                    <div className={styles['edit-form']}>
                      <input
                        type="text"
                        value={editingData.nombre || ''}
                        onChange={(e) => setEditingData({ ...editingData, nombre: e.target.value })}
                        className={styles['form-input']}
                      />
                      <input
                        type="text"
                        value={editingData.ciudad || ''}
                        onChange={(e) => setEditingData({ ...editingData, ciudad: e.target.value })}
                        className={styles['form-input']}
                      />
                      <div className={styles['form-actions']}>
                        <button className={`${styles.btn} ${styles['btn-sm']} ${styles['btn-success']}`} onClick={handleUpdateClub}>
                          Guardar
                        </button>
                        <button className={`${styles.btn} ${styles['btn-sm']} ${styles['btn-secondary']}`} onClick={() => setEditingId(null)}>
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className={styles['club-info']}>
                        <h3 className={styles['club-name']}>{club.nombre}</h3>
                        <p className={styles['club-city']}>📍 {club.ciudad}</p>
                        <span className={styles['club-id']}>ID: {club.id}</span>
                      </div>
                      <div className={styles['club-actions']}>
                        <button
                          className={`${styles.btn} ${styles['btn-sm']} ${styles['btn-edit']}`}
                          onClick={() => startEditing(club)}
                        >
                          Editar
                        </button>
                        <button
                          className={`${styles.btn} ${styles['btn-sm']} ${styles['btn-danger']}`}
                          onClick={() => handleDeleteClub(club.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              <div className={styles['empty-state']}>
                <p>No hay clubes registrados</p>
              </div>
            )}
          </div>

          <div className={styles.stats}>
            <div className={styles['stat-card']}>
              <span className={styles['stat-number']}>{clubes?.length || 0}</span>
              <span className={styles['stat-label']}>Clubes Total</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
