import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import ScrollProgress from './components/ScrollProgress'
import WhatsAppButton from './components/WhatsAppButton'
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import Process from './pages/Process'
import Contact from './pages/Contact'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminArtworks from './pages/admin/AdminArtworks'
import AdminProfile from './pages/admin/AdminProfile'
import About from './pages/About'

function Layout() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <>
      <ScrollProgress />
      {!isAdmin && <Navbar />}
      <div className={isAdmin ? '' : 'min-h-screen flex flex-col'}>
        {isAdmin ? (
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/artworks" element={<ProtectedRoute><AdminArtworks /></ProtectedRoute>} />
            <Route path="/admin/profile" element={<ProtectedRoute><AdminProfile /></ProtectedRoute>} />
          </Routes>
        ) : (
          <>
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/process" element={<Process />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </div>
            <Footer />
            <WhatsAppButton />
          </>
        )}
      </div>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}