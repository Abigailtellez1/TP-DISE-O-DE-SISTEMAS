import { type FormEvent, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { createReservation } from '../api/reservations'
import type { ReservationRequest } from '../types/reservation'

const emptyReservation: ReservationRequest = {
  listingId: 0,
  guestId: '',
  checkIn: '',
  checkOut: '',
  guests: 1,
}

export const ReservationFormPage = () => {
  const { role, userId, email } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState<ReservationRequest>(emptyReservation)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const listingParam = searchParams.get('listingId')
    if (listingParam) {
      const parsed = Number(listingParam)
      if (!Number.isNaN(parsed)) {
        setForm((prev) => ({ ...prev, listingId: parsed }))
      }
    }
  }, [searchParams])

  useEffect(() => {
    const detectedGuest = userId || email
    if (detectedGuest) {
      setForm((prev) => ({ ...prev, guestId: prev.guestId || detectedGuest }))
    }
  }, [userId, email])

  const handleChange = (key: keyof ReservationRequest, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const guest = form.guestId || userId || email || ''
    if (!guest) {
      setError('No se pudo detectar el usuario actual para crear la reserva.')
      setLoading(false)
      return
    }

    try {
      const payload: ReservationRequest = {
        ...form,
        listingId: Number(form.listingId),
        guests: Number(form.guests),
        guestId: guest,
      }
      await createReservation(payload)
      navigate(`/listings/${payload.listingId || ''}`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo crear la reserva'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  if (role !== 'student') {
    return (
      <div className="page">
        <header className="page-header">
          <div>
            <p className="pill">Reservas</p>
            <h1>Crear reserva</h1>
            <p className="subtitle">Solo los estudiantes pueden reservar alojamientos.</p>
          </div>
        </header>
        <div className="panel">
          <p className="error">Debés ingresar como estudiante para crear una reserva.</p>
          <div className="button-row">
            <button className="btn secondary" onClick={() => navigate('/listings')}>
              Volver a publicaciones
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="pill">Reservas</p>
          <h1>Crear una reserva</h1>
          <p className="subtitle">Completá las fechas y la cantidad de huéspedes.</p>
        </div>
      </header>

      <div className="panel">
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="listingId">ID del alojamiento</label>
            <input
              id="listingId"
              type="number"
              min={1}
              value={form.listingId}
              onChange={(e) => handleChange('listingId', e.target.valueAsNumber || 0)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="guestId">Usuario que reserva</label>
            <input
              id="guestId"
              value={form.guestId}
              onChange={(e) => handleChange('guestId', e.target.value)}
              required
            />
            <small className="muted">Se completa con tu usuario (email) al iniciar sesión.</small>
          </div>
          <div className="form-field">
            <label htmlFor="checkIn">Fecha de ingreso</label>
            <input
              id="checkIn"
              type="date"
              value={form.checkIn}
              onChange={(e) => handleChange('checkIn', e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="checkOut">Fecha de salida</label>
            <input
              id="checkOut"
              type="date"
              value={form.checkOut}
              onChange={(e) => handleChange('checkOut', e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="guests">Cantidad de huéspedes</label>
            <input
              id="guests"
              type="number"
              min={1}
              value={form.guests}
              onChange={(e) => handleChange('guests', e.target.valueAsNumber || 1)}
              required
            />
          </div>
          {error && <p className="error">Error: {error}</p>}
          <div className="button-row">
            <button className="btn success" type="submit" disabled={loading}>
              {loading ? 'Guardando…' : 'Confirmar reserva'}
            </button>
            <button className="btn secondary" type="button" onClick={() => navigate(-1)}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
