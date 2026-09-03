import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminOverview() {
  const [stats, setStats] = useState({ projects: 0, tools: 0, languages: 0, featured: 0 })
  const [recentProjects, setRecentProjects] = useState([])

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    const [projRes, toolsRes, langRes, featuredRes] = await Promise.all([
      supabase.from('projects').select('id', { count: 'exact', head: true }),
      supabase.from('tools').select('id', { count: 'exact', head: true }),
      supabase.from('project_languages').select('language'),
      supabase.from('projects').select('id', { count: 'exact', head: true }).eq('is_featured', true),
    ])

    const uniqueLangs = new Set((langRes.data || []).map((l) => l.language))

    setStats({
      projects: projRes.count || 0,
      tools: toolsRes.count || 0,
      languages: uniqueLangs.size,
      featured: featuredRes.count || 0,
    })

    const { data } = await supabase
      .from('projects')
      .select('title, created_at')
      .order('created_at', { ascending: false })
      .limit(5)
    setRecentProjects(data || [])
  }

  return (
    <div>
      <h1 className="admin-page-title">Admin <span>Overview</span></h1>
      <div className="stats" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <div className="stat-item">
          <h4>{stats.projects}</h4>
          <p>Total Projects</p>
        </div>
        <div className="stat-item">
          <h4>{stats.featured}</h4>
          <p>Featured Projects</p>
        </div>
        <div className="stat-item">
          <h4>{stats.tools}</h4>
          <p>Tools & Tech</p>
        </div>
        <div className="stat-item">
          <h4>{stats.languages}</h4>
          <p>Languages Used</p>
        </div>
      </div>

      <h3 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--secondary)' }}>Recent Projects</h3>
      {recentProjects.length === 0 ? (
        <p style={{ color: 'var(--light)' }}>No projects yet.</p>
      ) : (
        recentProjects.map((p, i) => (
          <div key={i} className="admin-card" style={{ padding: '1rem 1.5rem' }}>
            <div className="admin-card-info">
              <h4>{p.title}</h4>
              <p>{new Date(p.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
