import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import miniLogo from '../../resources/utn-logo-mini.svg'
import { upsertUserProfile } from '../api/users'

const DEFAULT_USER = 'ignaciospeicys'

export const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [userId, setUserId] = useState(DEFAULT_USER)
  const [role, setRole] = useState<'guest' | 'landlord'>('guest')
  const [profileEmail, setProfileEmail] = useState('estudiante@example.com')
  const [profileName, setProfileName] = useState('Estudiante UTN')
  const [preferredBedrooms, setPreferredBedrooms] = useState<number | null>(null)
  const [isSubmitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!userId.trim()) return
    login(userId.trim(), role)
    navigate('/listings')
  }

  const handleCreateProfile = async (e: FormEvent) => {
    e.preventDefault()
    if (!userId.trim()) {
      setError('Necesitás un ID de usuario')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await upsertUserProfile(userId.trim(), {
        email: profileEmail,
        name: profileName,
        preferredBedrooms: preferredBedrooms ?? undefined,
        isLandlord: role === 'landlord',
      })
      login(userId.trim(), role)
      navigate('/listings')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo guardar el perfil'
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
          <h1>Ingresá como estudiante o host</h1>
          <p className="subtitle">
            Usá el ID de estudiante para explorar publicaciones, reseñas y notificaciones, o entrá como
            anfitrión para crear tu propia publicación.
          </p>
        </div>
        <img src={miniLogo} alt="Logo UTN" className="mini-logo" />
      </header>

      <div className="panel">
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="userId">ID de usuario</label>
            <input
              id="userId"
              name="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Ingresá o confirmá tu usuario"
            />
            <small className="muted">Usuario sugerido: {DEFAULT_USER}</small>
          </div>
          <fieldset className="form-field" style={{ border: '1px solid #e5e7eb', padding: '0.75rem', borderRadius: '10px' }}>
            <legend className="muted" style={{ padding: '0 0.3rem' }}>
              Elegí tu rol
            </legend>
            <div className="button-row">
              <button
                type="button"
                className={`btn ${role === 'guest' ? '' : 'secondary'}`}
                onClick={() => setRole('guest')}
              >
                Entrar como estudiante
              </button>
              <button
                type="button"
                className={`btn ${role === 'landlord' ? '' : 'secondary'}`}
                onClick={() => setRole('landlord')}
              >
                Entrar como host
              </button>
            </div>
          </fieldset>
          <div className="button-row">
            <button type="submit" className="btn">
              Continuar
            </button>
          </div>
        </form>
      </div>

      <div className="panel">
        <h2 style={{ margin: '0 0 0.75rem 0' }}>Crear o actualizar perfil</h2>
        <p className="subtitle" style={{ margin: '0 0 1rem 0' }}>
          Este paso guarda tu rol (estudiante/anfitrión) en el backend.
        </p>
        <form className="form-grid" onSubmit={handleCreateProfile}>
          <div className="form-field">
            <label htmlFor="profileEmail">Email</label>
            <input
              id="profileEmail"
              value={profileEmail}
              onChange={(e) => setProfileEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="profileName">Nombre</label>
            <input
              id="profileName"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="preferredBedrooms">Preferencia de habitaciones</label>
            <input
              id="preferredBedrooms"
              type="number"
              min={0}
              max={10}
              value={preferredBedrooms ?? ''}
              onChange={(e) =>
                setPreferredBedrooms(Number.isNaN(e.target.valueAsNumber) ? null : e.target.valueAsNumber)
              }
              placeholder="Opcional"
            />
          </div>
          <div className="form-field">
            <label>Rol a guardar</label>
            <div className="button-row">
              <button
                type="button"
                className={`btn ${role === 'guest' ? '' : 'secondary'}`}
                onClick={() => setRole('guest')}
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
          </div>
          {error && <p className="error">Error: {error}</p>}
          <div className="button-row">
            <button className="btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando…' : 'Guardar perfil y entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
