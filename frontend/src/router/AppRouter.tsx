import { Navigate, Outlet, Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import { LoginPage } from '../pages/LoginPage'
import { ListingsPage } from '../pages/ListingsPage'
import { useAuth } from '../context/AuthContext'
import { ListingFormPage } from '../pages/ListingFormPage'
import { ListingDetailPage } from '../pages/ListingDetailPage'
import { AuthCallbackPage } from '../pages/AuthCallbackPage'
import { RegistrationPage } from '../pages/RegistrationPage'
import bannerImg from '../../resources/logo-utn-banner.png'

const Protected = () => {
  const { userId } = useAuth()
  if (!userId) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}

const AppLayout = () => {
  return (
    <div>
      <div className="banner">
        <img src={bannerImg} alt="Universidad Tecnológica Nacional - Alojamiento Estudiantil" />
      </div>
      <div className="page" style={{ paddingBottom: 0 }}>
        <div className="status-bar" style={{ justifyContent: 'space-between' }}>
          <span className="muted">Diseño de Sistemas · Alojamiento Estudiantil</span>
        </div>
      </div>
      <Outlet />
    </div>
  )
}

export const AppRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppLayout />}>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/auth/register" element={<RegistrationPage />} />
      <Route element={<Protected />}>
        <Route path="/listings" element={<ListingsPage />} />
        <Route path="/listings/new" element={<ListingFormPage />} />
        <Route path="/listings/:id" element={<ListingDetailPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Route>,
  ),
)
