import { useEffect, useState } from 'react'
import { fetchListings } from '../api/listings'
import type { Listing, Page } from '../types/listing'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { fetchUserNotifications } from '../api/users'
import type { ListingNotification } from '../types/user'
import { Modal } from '../components/Modal'
import { getListingVisuals } from '../utils/listingVisuals'
import { formatCurrency } from '../utils/formatters'

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
          <button className="icon-btn" type="button" onClick={openNotifications} aria-label="Ver notificaciones">
            <span className="bell-icon" aria-hidden="true" />
          </button>
          <button className="btn" type="button" onClick={() => navigate('/reservations')}>
            Mis reservas
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
            {state.data.content.length === 0 ? (
              <p className="muted" style={{ textAlign: 'center' }}>
                No hay publicaciones.
              </p>
            ) : (
              <div className="listing-grid">
                {state.data.content.map((listing) => {
                  const visuals = getListingVisuals(listing)
                  return (
                    <article key={listing.id} className="listing-card">
                      <img src={visuals.imageUrl} alt={listing.title} className="listing-card__image" />
                      <div className="listing-card__body">
                        <div className="listing-card__title">
                          <div>
                            <h3 style={{ margin: 0 }}>{listing.title}</h3>
                            <div className="listing-meta" style={{ marginTop: '0.3rem' }}>
                              <span>📍 {listing.city}</span>
                              <span>🏠 {listing.bedrooms} habs</span>
                              <span>👥 {listing.maxGuests} huéspedes</span>
                            </div>
                          </div>
                          <div className="rating-pill">
                            ★ {visuals.rating.toFixed(1)}
                            <span className="muted" style={{ fontSize: '0.8rem' }}>({visuals.reviews})</span>
                          </div>
                        </div>

                        <p className="muted" style={{ margin: 0 }}>{listing.description}</p>

                        <div className="listing-actions">
                          <div>
                            <div className="price-tag">{formatCurrency(listing.nightlyPrice)}</div>
                            <div className="muted" style={{ fontSize: '0.85rem' }}>por noche</div>
                          </div>
                          <button className="btn secondary" onClick={() => navigate(`/listings/${listing.id}`)}>
                            Ver detalle
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}

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
