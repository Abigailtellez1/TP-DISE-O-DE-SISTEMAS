import { useEffect, useState } from 'react'
import { fetchListings } from '../api/listings'
import type { Listing, Page } from '../types/listing'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { fetchUserNotifications } from '../api/users'
import type { ListingNotification } from '../types/user'
import { Modal } from '../components/Modal'

interface ListingPageState {
  data: Page<Listing> | null
  loading: boolean
  error: string | null
}

export const ListingsPage = () => {
  const { userId, role, logout } = useAuth()
  const navigate = useNavigate()
  const [page, setPage] = useState(0)
  const [size] = useState(5)
  const [state, setState] = useState<ListingPageState>({
    data: null,
    loading: true,
    error: null,
  })
  const [notifications, setNotifications] = useState<ListingNotification[]>([])
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifLoading, setNotifLoading] = useState(false)
  const [notifError, setNotifError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setState((prev) => ({ ...prev, loading: true, error: null }))
    const filters = role === 'landlord' && userId ? { ownerId: userId } : {}
    fetchListings(page, size, filters)
      .then((res) => {
        if (!active) return
        setState({ data: res, loading: false, error: null })
      })
      .catch((err: unknown) => {
        if (!active) return
        const message = err instanceof Error ? err.message : 'No se pudieron cargar las publicaciones'
        setState({ data: null, loading: false, error: message })
      })

    return () => {
      active = false
    }
  }, [page, size, role, userId])

  const totalPages = state.data?.totalPages ?? 0
  const canPrev = page > 0
  const canNext = page + 1 < totalPages

  const openNotifications = async () => {
    if (!userId) {
      setNotifError('Iniciá sesión para ver notificaciones')
      setNotifOpen(true)
      return
    }
    setNotifOpen(true)
    setNotifLoading(true)
    setNotifError(null)
    try {
      const res = await fetchUserNotifications(userId)
      setNotifications(res)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'No se pudieron cargar las notificaciones'
      setNotifError(msg)
    } finally {
      setNotifLoading(false)
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="pill">Publicaciones</p>
          <h1>Explorá los alojamientos</h1>
        </div>
        <div className="status-bar">
          <span className="muted">
            Usuario: {userId ?? 'invitado'} · Rol: {role === 'landlord' ? 'anfitrión' : 'estudiante'}
          </span>
          <button className="btn secondary" type="button" onClick={openNotifications}>
            Ver notificaciones
          </button>
          <button className="btn" type="button" onClick={logout}>
            Salir
          </button>
        </div>
      </header>

      <div className="panel">
        {role === 'landlord' && (
          <div className="button-row" style={{ marginBottom: '1rem' }}>
            <button className="btn" onClick={() => navigate('/listings/new')}>
              Crear publicación
            </button>
          </div>
        )}
        {state.loading && <p className="muted">Cargando publicaciones…</p>}
        {state.error && <p className="error">Error: {state.error}</p>}
        {!state.loading && !state.error && state.data && (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Barrio</th>
                  <th>Habitaciones</th>
                  <th>Huéspedes</th>
                  <th>Precio/noche</th>
                </tr>
              </thead>
              <tbody>
                {state.data.content.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="muted">
                      No hay publicaciones.
                    </td>
                  </tr>
                ) : (
                  state.data.content.map((listing) => (
                    <tr key={listing.id}>
                      <td>
                        <Link to={`/listings/${listing.id}`}>{listing.title}</Link>
                      </td>
                      <td>{listing.district}</td>
                      <td>{listing.bedrooms}</td>
                      <td>{listing.maxGuests}</td>
                      <td>${listing.nightlyPrice.toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div className="status-bar" style={{ justifyContent: 'space-between', marginTop: '1rem' }}>
              <div className="muted">
                Página {page + 1} de {totalPages || 1} · Total {state.data.totalElements} publicaciones
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

      <Modal open={notifOpen} title="Notificaciones" onClose={() => setNotifOpen(false)}>
        {notifLoading && <p className="muted">Cargando…</p>}
        {notifError && <p className="error">Error: {notifError}</p>}
        {!notifLoading && !notifError && (
          <>
            {notifications.length === 0 && <p className="muted">No tenés notificaciones nuevas.</p>}
            {notifications.map((n) => (
              <div key={`${n.listingId}-${n.listingTitle}`} className="form-field">
                <label>{n.listingTitle}</label>
                <div>Habitaciones: {n.bedrooms}</div>
              </div>
            ))}
          </>
        )}
      </Modal>
    </div>
  )
}
