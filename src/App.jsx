import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import Process from './pages/Process'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminArtworks from './pages/admin/AdminArtworks'
import AdminProfile from './pages/admin/AdminProfile'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/process" element={<Process />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/artworks" element={<ProtectedRoute><AdminArtworks /></ProtectedRoute>} />
        <Route path="/admin/profile" element={<ProtectedRoute><AdminProfile /></ProtectedRoute>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}