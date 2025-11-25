import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import miniLogo from '../../resources/utn-logo-mini.svg'

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
    </div>
  )
}
