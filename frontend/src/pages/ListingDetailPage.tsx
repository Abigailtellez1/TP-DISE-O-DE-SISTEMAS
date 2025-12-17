import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchListing } from '../api/listings'
import { createReview, fetchReviews } from '../api/reviews'
import { fetchReservations } from '../api/reservations'
import type { Listing } from '../types/listing'
import type { Review } from '../types/review'
import type { Reservation } from '../types/reservation'
import { useAuth } from '../context/AuthContext'
import { getListingVisuals } from '../utils/listingVisuals'
import { formatCurrency } from '../utils/formatters'

export const ListingDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { userId, role } = useAuth()
  const listingId = Number(id)
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [reviewsError, setReviewsError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [newRating, setNewRating] = useState(5)
  const [newComment, setNewComment] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [userReservation, setUserReservation] = useState<Reservation | null>(null)
  const [reservationLoading, setReservationLoading] = useState(false)

  useEffect(() => {
    if (!listingId) {
      setError('Missing listing id')
      setLoading(false)
      return
    }
    fetchListing(listingId)
      .then((res) => {
        setListing(res)
        setLoading(false)
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'No se pudo cargar el detalle'
        setError(message)
        setLoading(false)
      })
  }, [listingId])

  useEffect(() => {
    if (!listingId || !userId || role !== 'student') return
    let active = true
    setReservationLoading(true)
    fetchReservations(0, 1, { guestId: userId, listingId })
      .then((res) => {
        if (!active) return
        setUserReservation(res.content.length > 0 ? res.content[0] : null)
        setReservationLoading(false)
      })
      .catch(() => {
        if (!active) return
        setUserReservation(null)
        setReservationLoading(false)
      })
    return () => {
      active = false
    }
  }, [listingId, userId, role])

  useEffect(() => {
    if (!listingId) return
    let active = true
    setReviewsLoading(true)
    setReviewsError(null)
    fetchReviews(listingId, page, 5)
      .then((res) => {
        if (!active) return
        setReviews(res.content)
        setTotalPages(res.totalPages)
        setReviewsLoading(false)
      })
      .catch((err) => {
        if (!active) return
        const msg = err instanceof Error ? err.message : 'No se pudieron cargar las reseñas'
        setReviewsError(msg)
        setReviewsLoading(false)
      })
    return () => {
      active = false
    }
  }, [listingId, page])

  const handleSubmitReview = async () => {
    if (!listingId || !userId) return
    setSubmitLoading(true)
    setSubmitError(null)
    try {
      await createReview(listingId, {
        rating: newRating,
        comment: newComment,
        authorId: userId,
      })
      setNewComment('')
      setNewRating(5)
      setPage(0)
      // refresh reviews
      const res = await fetchReviews(listingId, 0, 5)
      setReviews(res.content)
      setTotalPages(res.totalPages)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'No se pudo publicar la reseña'
      setSubmitError(msg)
    } finally {
      setSubmitLoading(false)
    }
  }

  const canReview = userId !== null && role === 'student'
  const canReserve = userId !== null && role === 'student'
  const displayRole = role === 'landlord' ? 'Anfitrión' : 'Estudiante'

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="pill">Publicación</p>
          <h1>{listing ? listing.title : 'Detalle del alojamiento'}</h1>
        </div>
        <div className="button-row">
          <button
            className="btn success"
            onClick={() => navigate(`/reservations/new?listingId=${listingId}`)}
            disabled={!listingId || !canReserve}
            title={!canReserve ? 'Solo los estudiantes pueden crear reservas' : undefined}
          >
            Crear reserva
          </button>
          <button className="btn secondary" onClick={() => navigate('/listings')}>
            Volver a publicaciones
          </button>
        </div>
      </header>

      {!reservationLoading && userReservation && (
          <div style={{
            padding: '1rem',
            backgroundColor: '#4caf50',
            color: 'white',
            borderRadius: '20px',
            fontWeight: 'bold'
          }}>
            <div style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              ✓ Tenés una reserva activa en este alojamiento
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 'normal', opacity: 0.95 }}>
              Check-in: {new Date(userReservation.checkIn).toLocaleDateString('es-AR')} ·
              Check-out: {new Date(userReservation.checkOut).toLocaleDateString('es-AR')} ·
              {userReservation.guests} {userReservation.guests === 1 ? 'huésped' : 'huéspedes'}
            </div>
          </div>
      )}

      <div className="panel">
        {loading && <p className="muted">Cargando…</p>}
        {error && <p className="error">Error: {error}</p>}
        {!loading && !error && listing && (
          (() => {
            const visuals = getListingVisuals(listing)
            return (
              <>
                <div className="detail-hero">
                  <img src={visuals.imageUrl} alt={listing.title} />
                </div>
                <h2 style={{ marginTop: 0 }}>{listing.title}</h2>
                <p className="muted" style={{ marginTop: '0.3rem' }}>{listing.description}</p>
                <div className="detail-metrics">
                  <span className="detail-pill">📍 {listing.city} · {listing.district}</span>
                  <span className="detail-pill">🏠 {listing.bedrooms} habs</span>
                  <span className="detail-pill">👥 {listing.maxGuests} huéspedes</span>
                  <span className="detail-pill">💰 {formatCurrency(listing.nightlyPrice)} / noche</span>
                </div>
                <div className="detail-grid">
                  <div className="detail-highlight">
                    <h4>Propietario</h4>
                    <p style={{ margin: 0 }}>{listing.ownerId}</p>
                  </div>
                  <div className="detail-highlight">
                    <h4>Ubicación</h4>
                    <p style={{ margin: 0 }}>{listing.city}, {listing.district}</p>
                  </div>
                  <div className="detail-highlight">
                    <h4>Habitaciones</h4>
                    <p style={{ margin: 0 }}>{listing.bedrooms} habitaciones · {listing.maxGuests} huéspedes</p>
                  </div>
                </div>
              </>
            )
          })()
        )}
      </div>

      <div className="panel">
        <h2 style={{ marginTop: 0 }}>Reseñas</h2>
        {reviewsLoading && <p className="muted">Cargando reseñas…</p>}
        {reviewsError && <p className="error">Error: {reviewsError}</p>}
        {!reviewsLoading && !reviewsError && (
          <>
            {reviews.length === 0 && <p className="muted">Todavía no hay reseñas.</p>}
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <strong>{review.authorName}</strong>
                  <span className="muted">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <div style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>
                  {'★'.repeat(review.rating).padEnd(5, '☆')}
                </div>
                <p style={{ margin: 0 }}>{review.comment}</p>
              </div>
            ))}
            {totalPages > 1 && (
              <div className="button-row" style={{ marginTop: '0.75rem' }}>
                <button className="btn secondary" onClick={() => setPage((p) => p - 1)} disabled={page === 0}>
                  Anterior
                </button>
                <button className="btn secondary" onClick={() => setPage((p) => p + 1)} disabled={page + 1 >= totalPages}>
                  Siguiente
                </button>
                <span className="muted">
                  Página {page + 1} de {totalPages}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {canReview && (
        <div className="panel">
          <h3 style={{ marginTop: 0 }}>Dejar una reseña</h3>
          <p className="subtitle">
            Usuario: {userId ?? 'sin sesión'} · Rol detectado: {displayRole}
          </p>
          <div className="form-grid">
            <div className="form-field">
              <label>Calificación (1-5)</label>
              <input
                type="number"
                min={1}
                max={5}
                value={newRating}
                onChange={(e) => setNewRating(Math.max(1, Math.min(5, e.target.valueAsNumber || 1)))}
              />
            </div>
            <div className="form-field">
              <label>Comentario</label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Contanos tu experiencia"
              />
            </div>
            {submitError && <p className="error">Error: {submitError}</p>}
            <div className="button-row">
              <button
                className="btn"
                type="button"
                onClick={handleSubmitReview}
                disabled={submitLoading || newComment.trim().length === 0}
              >
                {submitLoading ? 'Enviando…' : 'Publicar reseña'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
