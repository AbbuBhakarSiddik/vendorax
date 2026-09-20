import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ErrorBoundary from './components/ui/ErrorBoundary'
import ProtectedRoute from './components/ui/ProtectedRoute'
import Navbar from './components/ui/Navbar'

const NotFound = lazy(() => import('./pages/NotFound'))
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))

const StorePage = lazy(() => import('./pages/buyer/StorePage'))
const ProductPage = lazy(() => import('./pages/buyer/ProductPage'))
const Cart = lazy(() => import('./pages/buyer/Cart'))
const Checkout = lazy(() => import('./pages/buyer/Checkout'))
const OrderHistory = lazy(() => import('./pages/buyer/OrderHistory'))
const Profile = lazy(() => import('./pages/buyer/Profile'))

const SellerDashboard = lazy(() => import('./pages/seller/Dashboard'))
const CreateStore = lazy(() => import('./pages/seller/Dashboard/CreateStore'))
const SellerProducts = lazy(() => import('./pages/seller/Products'))
const SellerOrders = lazy(() => import('./pages/seller/Orders'))
const SellerAnalytics = lazy(() => import('./pages/seller/Analytics'))
const SellerAITools = lazy(() => import('./pages/seller/AITools'))

const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
const ManageUsers = lazy(() => import('./pages/admin/ManageUsers'))
const ManageStores = lazy(() => import('./pages/admin/ManageStores'))

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Navbar />
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/store/:slug" element={<StorePage />} />
            <Route path="/product/:id" element={<ProductPage />} />

            {/* Buyer */}
            <Route path="/cart" element={
              <ProtectedRoute allowedRoles={['buyer']}><Cart /></ProtectedRoute>
            } />
            <Route path="/checkout" element={
              <ProtectedRoute allowedRoles={['buyer']}><Checkout /></ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute allowedRoles={['buyer']}><OrderHistory /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute allowedRoles={['buyer']}><Profile /></ProtectedRoute>
            } />

            {/* Seller */}
            <Route path="/seller/dashboard" element={
              <ProtectedRoute allowedRoles={['seller']}><SellerDashboard /></ProtectedRoute>
            } />
            <Route path="/seller/store/create" element={
              <ProtectedRoute allowedRoles={['seller']}><CreateStore /></ProtectedRoute>
            } />
            <Route path="/seller/products" element={
              <ProtectedRoute allowedRoles={['seller']}><SellerProducts /></ProtectedRoute>
            } />
            <Route path="/seller/orders" element={
              <ProtectedRoute allowedRoles={['seller']}><SellerOrders /></ProtectedRoute>
            } />
            <Route path="/seller/analytics" element={
              <ProtectedRoute allowedRoles={['seller']}><SellerAnalytics /></ProtectedRoute>
            } />
            <Route path="/seller/ai-tools" element={
              <ProtectedRoute allowedRoles={['seller']}><SellerAITools /></ProtectedRoute>
            } />

            {/* Admin */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute allowedRoles={['admin']}><ManageUsers /></ProtectedRoute>
            } />
            <Route path="/admin/stores" element={
              <ProtectedRoute allowedRoles={['admin']}><ManageStores /></ProtectedRoute>
            } />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App
