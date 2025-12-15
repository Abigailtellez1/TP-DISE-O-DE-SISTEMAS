import { useEffect, useState } from 'react'
import { fetchReservations } from '../api/reservations'
import type { Reservation, Page } from '../types/reservation'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

interface ReservationPageState {
  data: Page<Reservation> | null
  loading: boolean
  error: string | null
}

export const ReservationsPage = () => {
  const { userId, role, logout } = useAuth()
  const navigate = useNavigate()
  const [page, setPage] = useState(0)
  const [size] = useState(5)
  const [state, setState] = useState<ReservationPageState>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let active = true
    setState((prev) => ({ ...prev, loading: true, error: null }))
    const filters = role === 'student' && userId ? { guestId: userId } : {}
    fetchReservations(page, size, filters)
      .then((res) => {
        if (!active) return
        setState({ data: res, loading: false, error: null })
      })
      .catch((err: unknown) => {
        if (!active) return
        const message = err instanceof Error ? err.message : 'No se pudieron cargar las reservas'
        setState({ data: null, loading: false, error: message })
      })

    return () => {
      active = false
    }
  }, [page, size, role, userId])

  const totalPages = state.data?.totalPages ?? 0
  const canPrev = page > 0
  const canNext = page + 1 < totalPages

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="pill">Reservas</p>
          <h1>Mis Reservas</h1>
        </div>
        <div className="status-bar">
          <span className="muted">
            Usuario: {userId ?? 'invitado'} · Rol: {role === 'landlord' ? 'anfitrión' : 'estudiante'}
          </span>
          <button className="btn" type="button" onClick={() => navigate('/listings')}>
            Ver publicaciones
          </button>
          <button className="btn" type="button" onClick={logout}>
            Salir
          </button>
        </div>
      </header>

      <div className="panel">
        {role === 'student' && (
          <div className="button-row" style={{ marginBottom: '1rem' }}>
            <button className="btn" onClick={() => navigate('/reservations/new')}>
              Crear reserva
            </button>
          </div>
        )}
        {state.loading && <p className="muted">Cargando reservas…</p>}
        {state.error && <p className="error">Error: {state.error}</p>}
        {!state.loading && !state.error && state.data && (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>Alojamiento</th>
                  {role === 'landlord' && <th>Huésped</th>}
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Huéspedes</th>
                </tr>
              </thead>
              <tbody>
                {state.data.content.length === 0 ? (
                  <tr>
                    <td colSpan={role === 'landlord' ? 5 : 4} className="muted">
                      No hay reservas.
                    </td>
                  </tr>
                ) : (
                  state.data.content.map((reservation) => (
                    <tr key={reservation.id}>
                      <td>{reservation.listingTitle}</td>
                      {role === 'landlord' && <td>{reservation.guestName}</td>}
                      <td>{new Date(reservation.checkIn).toLocaleDateString('es-AR')}</td>
                      <td>{new Date(reservation.checkOut).toLocaleDateString('es-AR')}</td>
                      <td>{reservation.guests}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div className="status-bar" style={{ justifyContent: 'space-between', marginTop: '1rem' }}>
              <div className="muted">
                Página {page + 1} de {totalPages || 1} · Total {state.data.totalElements} reservas
              </div>
              <div className="button-row">
                <button className="btn secondary" onClick={() => setPage((p) => p - 1)} disabled={!canPrev}>
                  Anterior
                </button>
                <button className="btn secondary" onClick={() => setPage((p) => p + 1)} disabled={!canNext}>
                  Siguiente
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
