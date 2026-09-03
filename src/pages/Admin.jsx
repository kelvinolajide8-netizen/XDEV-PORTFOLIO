import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import AdminOverview from './admin/AdminOverview'
import AdminProjects from './admin/AdminProjects'
import AdminTools from './admin/AdminTools'

export default function Admin() {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'projects', label: 'Projects' },
    { id: 'tools', label: 'Tools & Tech' },
  ]

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
        <Link to="/" className="admin-back-link" style={{ margin: '1.5rem', display: 'inline-flex' }}>
          <ArrowLeft size={16} /> Back to Site
        </Link>
      </aside>
      <main className="admin-content">
        {activeTab === 'overview' && <AdminOverview />}
        {activeTab === 'projects' && <AdminProjects />}
        {activeTab === 'tools' && <AdminTools />}
      </main>
    </div>
  )
}
