import { useEffect, useState } from 'react'
import { fetchListings } from '../api/listings'
import type { Listing, Page } from '../types/listing'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

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

  useEffect(() => {
    let active = true
    setState((prev) => ({ ...prev, loading: true, error: null }))
    fetchListings(page, size)
      .then((res) => {
        if (!active) return
        setState({ data: res, loading: false, error: null })
      })
      .catch((err: unknown) => {
        if (!active) return
        const message = err instanceof Error ? err.message : 'Failed to load listings'
        setState({ data: null, loading: false, error: message })
      })

    return () => {
      active = false
    }
  }, [page, size])

  const totalPages = state.data?.totalPages ?? 0
  const canPrev = page > 0
  const canNext = page + 1 < totalPages

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="pill">Listings</p>
          <h1>Browse available stays</h1>
          <p className="subtitle">
            Minimal view hitting the paginated backend endpoint (Spring Pageable).
          </p>
        </div>
        <div className="status-bar">
          <span className="muted">
            User: {userId ?? 'guest'} · Role: {role}
          </span>
          <button className="btn secondary" type="button" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <div className="panel">
        {role === 'landlord' && (
          <div className="button-row" style={{ marginBottom: '1rem' }}>
            <button className="btn" onClick={() => navigate('/listings/new')}>
              Create listing
            </button>
          </div>
        )}
        {state.loading && <p className="muted">Loading listings…</p>}
        {state.error && <p className="error">Error: {state.error}</p>}
        {!state.loading && !state.error && state.data && (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>City</th>
                  <th>District</th>
                  <th>Bedrooms</th>
                  <th>Guests</th>
                  <th>Nightly price</th>
                  <th>Owner</th>
                </tr>
              </thead>
              <tbody>
                {state.data.content.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="muted">
                      No listings found.
                    </td>
                  </tr>
                ) : (
                  state.data.content.map((listing) => (
                    <tr key={listing.id}>
                      <td>
                        <Link to={`/listings/${listing.id}`}>{listing.title}</Link>
                      </td>
                      <td>{listing.city}</td>
                      <td>{listing.district}</td>
                      <td>{listing.bedrooms}</td>
                      <td>{listing.maxGuests}</td>
                      <td>${listing.nightlyPrice.toFixed(2)}</td>
                      <td>{listing.ownerId}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div className="status-bar" style={{ justifyContent: 'space-between', marginTop: '1rem' }}>
              <div className="muted">
                Page {page + 1} of {totalPages || 1} · Total {state.data.totalElements} listings
              </div>
              <div className="button-row">
                <button className="btn secondary" onClick={() => setPage((p) => p - 1)} disabled={!canPrev}>
                  Previous
                </button>
                <button className="btn secondary" onClick={() => setPage((p) => p + 1)} disabled={!canNext}>
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
