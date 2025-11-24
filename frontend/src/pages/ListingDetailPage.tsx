import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchListing } from '../api/listings'
import type { Listing } from '../types/listing'

export const ListingDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const listingId = Number(id)
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        const message = err instanceof Error ? err.message : 'Failed to load listing'
        setError(message)
        setLoading(false)
      })
  }, [listingId])

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="pill">Listing</p>
          <h1>{listing ? listing.title : 'Listing details'}</h1>
          <p className="subtitle">Quick detail view from the backend.</p>
        </div>
        <div className="button-row">
          <button className="btn secondary" onClick={() => navigate('/listings')}>
            Back to listings
          </button>
        </div>
      </header>

      <div className="panel">
        {loading && <p className="muted">Loading…</p>}
        {error && <p className="error">Error: {error}</p>}
        {!loading && !error && listing && (
          <div className="form-grid">
            <div className="form-field">
              <label>City</label>
              <div>{listing.city}</div>
            </div>
            <div className="form-field">
              <label>District</label>
              <div>{listing.district}</div>
            </div>
            <div className="form-field">
              <label>Nightly price</label>
              <div>${listing.nightlyPrice.toFixed(2)}</div>
            </div>
            <div className="form-field">
              <label>Bedrooms</label>
              <div>{listing.bedrooms}</div>
            </div>
            <div className="form-field">
              <label>Max guests</label>
              <div>{listing.maxGuests}</div>
            </div>
            <div className="form-field">
              <label>Owner</label>
              <div>{listing.ownerId}</div>
            </div>
            <div className="form-field">
              <label>Description</label>
              <div>{listing.description}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
