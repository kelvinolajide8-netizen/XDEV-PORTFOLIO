import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import { AdminAuthProvider } from './lib/adminAuth'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Admin from './pages/Admin'
import AdminLogin from './components/AdminLogin'

export default function App() {
  const [showLogin, setShowLogin] = useState(false)

  function handleFooterYearClick() {
    setShowLogin(true)
  }

  return (
    <AdminAuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <footer className="footer">
        <p>
          &copy;{' '}
          <span
            style={{ cursor: 'pointer', transition: 'color 0.3s' }}
            onClick={handleFooterYearClick}
            onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--light)'}
            title=""
          >
            2026
          </span>{' '}
          Xdev Portfolio.
        </p>
      </footer>
      {showLogin && (
        <AdminLogin onClose={() => setShowLogin(false)} onSuccess={() => setShowLogin(false)} />
      )}
    </AdminAuthProvider>
  )
}
