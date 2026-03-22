import { Navigate } from 'react-router-dom'
import useAuthStore from '../../store/useAuthStore'
import { jwtDecode } from 'jwt-decode'

const isTokenValid = (token) => {
  if (!token) return false
  try {
    const decoded = jwtDecode(token)
    return decoded.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, accessToken, logout } = useAuthStore()

  if (!isTokenValid(accessToken)) {
    logout()
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute