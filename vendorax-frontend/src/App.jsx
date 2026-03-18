import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ui/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import SellerDashboard from './pages/seller/Dashboard'
import SellerProducts from './pages/seller/Products'
import SellerOrders from './pages/seller/Orders'
import SellerAnalytics from './pages/seller/Analytics'
import SellerAITools from './pages/seller/AITools'
import StorePage from './pages/buyer/StorePage'
import ProductPage from './pages/buyer/ProductPage'
import Cart from './pages/buyer/Cart'
import Checkout from './pages/buyer/Checkout'
import OrderHistory from './pages/buyer/OrderHistory'
import AdminDashboard from './pages/admin/Dashboard'
import ManageUsers from './pages/admin/ManageUsers'
import ManageStores from './pages/admin/ManageStores'
import Navbar from './components/ui/Navbar'
import CreateStore from './pages/seller/Dashboard/CreateStore'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/store/:slug" element={<StorePage />} />
        <Route path="/product/:id" element={<ProductPage />} />

        {/* Buyer */}
        <Route path="/cart" element={
          <ProtectedRoute allowedRoles={['buyer']}>
            <Cart />
          </ProtectedRoute>
        } />
        <Route path="/checkout" element={
          <ProtectedRoute allowedRoles={['buyer']}>
            <Checkout />
          </ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute allowedRoles={['buyer']}>
            <OrderHistory />
          </ProtectedRoute>
        } />

        {/* Seller */}
        <Route path="/seller/dashboard" element={
          <ProtectedRoute allowedRoles={['seller']}>
            <SellerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/seller/store/create" element={
          <ProtectedRoute allowedRoles={['seller']}>
            <CreateStore />
          </ProtectedRoute>
        } />
        <Route path="/seller/products" element={
          <ProtectedRoute allowedRoles={['seller']}>
            <SellerProducts />
          </ProtectedRoute>
        } />
        <Route path="/seller/orders" element={
          <ProtectedRoute allowedRoles={['seller']}>
            <SellerOrders />
          </ProtectedRoute>
        } />
        <Route path="/seller/analytics" element={
          <ProtectedRoute allowedRoles={['seller']}>
            <SellerAnalytics />
          </ProtectedRoute>
        } />
        <Route path="/seller/ai-tools" element={
          <ProtectedRoute allowedRoles={['seller']}>
            <SellerAITools />
          </ProtectedRoute>
        } />

        {/* Admin */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ManageUsers />
          </ProtectedRoute>
        } />
        <Route path="/admin/stores" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ManageStores />
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App