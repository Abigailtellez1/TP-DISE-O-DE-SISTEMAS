import { Navigate, Outlet, Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import { LoginPage } from '../pages/LoginPage'
import { ListingsPage } from '../pages/ListingsPage'
import { useAuth } from '../context/AuthContext'
import { API_BASE_URL } from '../api/client'
import { ListingFormPage } from '../pages/ListingFormPage'
import { ListingDetailPage } from '../pages/ListingDetailPage'

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
      <div className="page" style={{ paddingBottom: 0 }}>
        <div className="status-bar" style={{ justifyContent: 'space-between' }}>
          <span className="muted">Frontend · Alojamiento Estudiantil</span>
          <span className="muted">
            Backend: <code>{API_BASE_URL}</code>
          </span>
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
      <Route element={<Protected />}>
        <Route path="/listings" element={<ListingsPage />} />
        <Route path="/listings/new" element={<ListingFormPage />} />
        <Route path="/listings/:id" element={<ListingDetailPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Route>,
  ),
)
