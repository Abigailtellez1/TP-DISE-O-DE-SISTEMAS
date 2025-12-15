import { type FormEvent, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import miniLogo from '../../resources/utn-logo-mini.svg'

export function RegistrationPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const googleEmail = searchParams.get('email') || ''
  const googleName = searchParams.get('name') || ''

  const [role, setRole] = useState<'student' | 'landlord'>('student')
  const [preferredBedrooms, setPreferredBedrooms] = useState<number | null>(null)
  const [isSubmitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!googleEmail || !googleName) {
      navigate('/login', { replace: true })
    }
  }, [googleEmail, googleName, navigate])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: googleEmail,
          name: googleName,
          role: role === 'student' ? 'STUDENT' : 'LANDLORD',
          preferredBedrooms: role === 'student' ? preferredBedrooms : null,
        }),
      })

      if (!response.ok) {
        throw new Error('Error al registrarse')
      }

      const { token } = await response.json()
      login(token)
      navigate('/listings', { replace: true })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo completar el registro'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="pill">Alojamiento Estudiantil</p>
          <h1>Completá tu perfil</h1>
          <p className="subtitle">
            Ya verificamos tu identidad con Google. Ahora elegí tu rol y completá tu perfil.
          </p>
        </div>
        <img src={miniLogo} alt="Logo UTN" className="mini-logo" />
      </header>

      <div className="panel">
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="email">Email (desde Google)</label>
            <input
              id="email"
              value={googleEmail}
              disabled
              style={{ opacity: 0.7, cursor: 'not-allowed' }}
            />
          </div>

          <div className="form-field">
            <label htmlFor="name">Nombre (desde Google)</label>
            <input
              id="name"
              value={googleName}
              disabled
              style={{ opacity: 0.7, cursor: 'not-allowed' }}
            />
          </div>

          <fieldset
            className="form-field"
            style={{ border: '1px solid #e5e7eb', padding: '0.75rem', borderRadius: '10px' }}
          >
            <legend className="muted" style={{ padding: '0 0.3rem' }}>
              Elegí tu rol
            </legend>
            <div className="button-row">
              <button
                type="button"
                className={`btn ${role === 'student' ? '' : 'secondary'}`}
                onClick={() => setRole('student')}
              >
                Estudiante
              </button>
              <button
                type="button"
                className={`btn ${role === 'landlord' ? '' : 'secondary'}`}
                onClick={() => setRole('landlord')}
              >
                Anfitrión
              </button>
            </div>
          </fieldset>

          {role === 'student' && (
            <div className="form-field">
              <label htmlFor="preferredBedrooms">Preferencia de habitaciones</label>
              <input
                id="preferredBedrooms"
                type="number"
                min={0}
                max={10}
                value={preferredBedrooms ?? ''}
                onChange={(e) =>
                  setPreferredBedrooms(
                    Number.isNaN(e.target.valueAsNumber) ? null : e.target.valueAsNumber
                  )
                }
                placeholder="Opcional (0-10)"
              />
            </div>
          )}

          {error && <p className="error">Error: {error}</p>}

          <div className="button-row">
            <button className="btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Registrando…' : 'Completar registro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
