import { FormEvent, useState } from 'react'
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
  maxGuests: 1,
}

export const ListingFormPage = () => {
  const { role } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState<ListingRequest>(emptyListing)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

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
      })
      navigate('/listings')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create listing'
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
            <p className="pill">Listings</p>
            <h1>Create listing</h1>
            <p className="subtitle">Only landlords can create listings.</p>
          </div>
        </header>
        <div className="panel">
          <p className="error">You must be logged in as landlord to create listings.</p>
          <div className="button-row">
            <button className="btn secondary" onClick={() => navigate('/listings')}>
              Back to listings
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
          <p className="pill">Listings</p>
          <h1>Create a new listing</h1>
          <p className="subtitle">Provide the basic details to publish your listing.</p>
        </div>
      </header>

      <div className="panel">
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="description">Description</label>
            <input
              id="description"
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="city">City</label>
            <input
              id="city"
              value={form.city}
              onChange={(e) => handleChange('city', e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="nightlyPrice">Nightly price</label>
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
            <label htmlFor="bedrooms">Bedrooms</label>
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
            <label htmlFor="maxGuests">Max guests</label>
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
              {loading ? 'Saving…' : 'Create listing'}
            </button>
            <button className="btn secondary" type="button" onClick={() => navigate('/listings')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
