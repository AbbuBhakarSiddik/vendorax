import { Navigate } from 'react-router-dom'
import useAuthStore from '../../store/useAuthStore'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = useAuthStore((s) => s.user)

  if (!user) return <Navigate to="/login" replace />

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute