import { useEffect } from 'react'
import { useSupabase } from '../hooks/useSupabase'
import type { Clubes } from '../types/Clubes'

export function UsersList() {
  const { data: users, loading, error, fetchData, insert, update, delete: deleteUser } = useSupabase<Clubes>({
    table: 'clubes',
  })

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleAddUser = async () => {
    await insert([
      {
        id: 0,
        nombre: 'Nuevo Club',
        ciudad: 'Tu ciudad',
      },
    ])
  }

  const handleUpdateUser = async (id: number) => {
    await update(id, { nombre: 'Nombre Actualizado' })
  }

  const handleDeleteUser = async (id: number) => {
    await deleteUser(id)
  }

  if (loading) return <div>Cargando...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <h1>Clubes</h1>
      <button onClick={handleAddUser}>Agregar Club</button>

      <ul>
        {users?.map((club) => (
          <li key={club.id}>
            <p>{club.nombre} - {club.ciudad}</p>
            <button onClick={() => handleUpdateUser(club.id)}>Editar</button>
            <button onClick={() => handleDeleteUser(club.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
