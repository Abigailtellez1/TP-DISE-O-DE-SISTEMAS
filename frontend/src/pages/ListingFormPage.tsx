import { type FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createListing } from '../api/listings'
import type { ListingRequest } from '../types/listing'
import { useAuth } from '../context/AuthContext'

const emptyListing: ListingRequest = {
  title: '',
  description: '',
  nightlyPrice: 0,
  bedrooms: 1,
  city: '',
  district: '',
  ownerId: '',
  maxGuests: 1,
}

export const ListingFormPage = () => {
  const { role, userId } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState<ListingRequest>(emptyListing)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (userId) {
      setForm((prev) => ({ ...prev, ownerId: prev.ownerId || userId }))
    }
  }, [userId])

  const handleChange = (key: keyof ListingRequest, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await createListing({
        ...form,
        nightlyPrice: Number(form.nightlyPrice),
        bedrooms: Number(form.bedrooms),
        maxGuests: Number(form.maxGuests),
        ownerId: form.ownerId || userId || '',
      })
      navigate('/listings')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo crear la publicación'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  if (role !== 'landlord') {
    return (
      <div className="page">
        <header className="page-header">
          <div>
            <p className="pill">Publicaciones</p>
            <h1>Crear publicación</h1>
            <p className="subtitle">Solo los anfitriones pueden crear publicaciones.</p>
          </div>
        </header>
        <div className="panel">
          <p className="error">Debés ingresar como anfitrión para crear una publicación.</p>
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
          <p className="pill">Publicaciones</p>
          <h1>Crear un nuevo alojamiento</h1>
          <p className="subtitle">Cargá los datos básicos para publicar tu alojamiento.</p>
        </div>
      </header>

      <div className="panel">
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="title">Título</label>
            <input
              id="title"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="description">Descripción</label>
            <input
              id="description"
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="city">Ciudad</label>
            <input
              id="city"
              value={form.city}
              onChange={(e) => handleChange('city', e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="district">Barrio</label>
            <input
              id="district"
              value={form.district}
              onChange={(e) => handleChange('district', e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="nightlyPrice">Precio por noche</label>
            <input
              id="nightlyPrice"
              type="number"
              min={0}
              step={1}
              value={form.nightlyPrice}
              onChange={(e) => handleChange('nightlyPrice', e.target.valueAsNumber || 0)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="ownerId">ID del propietario</label>
            <input
              id="ownerId"
              value={form.ownerId}
              onChange={(e) => handleChange('ownerId', e.target.value)}
              required
            />
            <small className="muted">Se completa con tu usuario al iniciar sesión.</small>
          </div>
          <div className="form-field">
            <label htmlFor="bedrooms">Habitaciones</label>
            <input
              id="bedrooms"
              type="number"
              min={0}
              value={form.bedrooms}
              onChange={(e) => handleChange('bedrooms', e.target.valueAsNumber || 0)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="maxGuests">Máximo de huéspedes</label>
            <input
              id="maxGuests"
              type="number"
              min={1}
              value={form.maxGuests}
              onChange={(e) => handleChange('maxGuests', e.target.valueAsNumber || 1)}
              required
            />
          </div>
          {error && <p className="error">Error: {error}</p>}
          <div className="button-row">
            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Guardando…' : 'Crear publicación'}
            </button>
            <button className="btn secondary" type="button" onClick={() => navigate('/listings')}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
