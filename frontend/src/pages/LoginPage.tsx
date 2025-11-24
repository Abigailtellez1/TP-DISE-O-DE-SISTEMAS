import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const DEFAULT_USER = 'ignaciospeicys'

export const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [userId, setUserId] = useState(DEFAULT_USER)
  const [role, setRole] = useState<'guest' | 'landlord'>('guest')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!userId.trim()) return
    login(userId.trim(), role)
    navigate('/listings')
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="pill">Alojamiento Estudiantil</p>
          <h1>Login as guest</h1>
          <p className="subtitle">Use the guest ID to explore listings, reviews, and notifications.</p>
        </div>
      </header>

      <div className="panel">
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="userId">User ID</label>
            <input
              id="userId"
              name="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter or confirm your user id"
            />
            <small className="muted">Default guest: {DEFAULT_USER}</small>
          </div>
          <fieldset className="form-field" style={{ border: '1px solid #e5e7eb', padding: '0.75rem', borderRadius: '10px' }}>
            <legend className="muted" style={{ padding: '0 0.3rem' }}>
              Choose a role
            </legend>
            <div className="button-row">
              <button
                type="button"
                className={`btn ${role === 'guest' ? '' : 'secondary'}`}
                onClick={() => setRole('guest')}
              >
                Log in as guest
              </button>
              <button
                type="button"
                className={`btn ${role === 'landlord' ? '' : 'secondary'}`}
                onClick={() => setRole('landlord')}
              >
                Log in as landlord
              </button>
            </div>
          </fieldset>
          <div className="button-row">
            <button type="submit" className="btn">
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
