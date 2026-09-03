import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { ArrowLeft, LogOut } from 'lucide-react'
import { useAdminAuth } from '../lib/adminAuth'
import AdminOverview from './admin/AdminOverview'
import AdminProjects from './admin/AdminProjects'
import AdminTools from './admin/AdminTools'
import AdminAbout from './admin/AdminAbout'
import AdminSocialLinks from './admin/AdminSocialLinks'

export default function Admin() {
  const [activeTab, setActiveTab] = useState('overview')
  const { isAuthenticated, logout } = useAdminAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) {
    return <div className="section" style={{ paddingTop: '8rem' }}><p className="loading">Redirecting...</p></div>
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'projects', label: 'Projects' },
    { id: 'tools', label: 'Tools & Tech' },
    { id: 'about', label: 'About Section' },
    { id: 'socials', label: 'Social Links' },
  ]

  function handleLogout() {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`admin-nav-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </div>
        ))}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
          <Link to="/" className="admin-back-link" style={{ margin: '0 1.5rem', display: 'inline-flex' }}>
            <ArrowLeft size={16} /> Back to Site
          </Link>
          <button
            onClick={handleLogout}
            className="admin-back-link"
            style={{ margin: '0 1.5rem', display: 'inline-flex', background: 'none', border: 'none', color: '#ff5757', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.9rem' }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
      <main className="admin-content">
        {activeTab === 'overview' && <AdminOverview />}
        {activeTab === 'projects' && <AdminProjects />}
        {activeTab === 'tools' && <AdminTools />}
        {activeTab === 'about' && <AdminAbout />}
        {activeTab === 'socials' && <AdminSocialLinks />}
      </main>
    </div>
  )
}
