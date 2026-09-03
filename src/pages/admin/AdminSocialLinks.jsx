import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

const PLATFORMS = [
  'github', 'linkedin', 'twitter', 'instagram', 'facebook',
  'youtube', 'dribbble', 'behance', 'tiktok', 'discord',
  'telegram', 'whatsapp', 'medium', 'stackoverflow', 'other',
]

export default function AdminSocialLinks() {
  const [socials, setSocials] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [platform, setPlatform] = useState('github')
  const [displayName, setDisplayName] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    loadSocials()
  }, [])

  async function loadSocials() {
    const { data } = await supabase.from('social_links').select('*').order('sort_order')
    setSocials(data || [])
    setLoading(false)
  }

  function handleAdd() {
    setEditing(null)
    setPlatform('github')
    setDisplayName('')
    setUrl('')
    setShowForm(true)
  }

  function handleEdit(social) {
    setEditing(social)
    setPlatform(social.platform)
    setDisplayName(social.display_name)
    setUrl(social.url)
    setShowForm(true)
  }

  async function handleDelete(social) {
    if (!confirm(`Delete "${social.display_name}"?`)) return
    await supabase.from('social_links').delete().eq('id', social.id)
    loadSocials()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (editing) {
      await supabase.from('social_links').update({
        platform, display_name: displayName, url,
      }).eq('id', editing.id)
    } else {
      const maxOrder = socials.length > 0 ? Math.max(...socials.map((s) => s.sort_order)) : 0
      await supabase.from('social_links').insert({
        platform, display_name: displayName, url, sort_order: maxOrder + 1,
      })
    }
    setShowForm(false)
    setEditing(null)
    loadSocials()
  }

  return (
    <div>
      <h1 className="admin-page-title">Manage <span>Social Links</span></h1>
      <button className="admin-add-btn" onClick={handleAdd}>
        <Plus size={18} /> Add Social Link
      </button>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : socials.length === 0 ? (
        <p className="no-results">No social links yet. Click "Add Social Link" to create one.</p>
      ) : (
        socials.map((social) => (
          <div className="admin-card" key={social.id}>
            <div className="admin-card-placeholder" style={{ width: '50px', height: '50px', borderRadius: '10px', fontSize: '1.25rem' }}>
              {social.platform.charAt(0).toUpperCase()}
            </div>
            <div className="admin-card-info">
              <h4>{social.display_name}</h4>
              <p>{social.url}</p>
            </div>
            <div className="admin-card-actions">
              <button className="admin-action-btn edit" onClick={() => handleEdit(social)}>
                <Pencil size={14} /> Edit
              </button>
              <button className="admin-action-btn delete" onClick={() => handleDelete(social)}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-form" onClick={(e) => e.stopPropagation()}>
            <div className="modal-form-header">
              <h3>{editing ? 'Edit Social Link' : 'Add Social Link'}</h3>
              <button className="gallery-close" onClick={() => setShowForm(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-form-body">
                <div className="form-group">
                  <label>Platform</label>
                  <select value={platform} onChange={(e) => {
                    setPlatform(e.target.value)
                    if (!displayName || displayName === editing?.display_name) {
                      setDisplayName(e.target.options[e.target.selectedIndex].text)
                    }
                  }}>
                    {PLATFORMS.map((p) => (
                      <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. GitHub"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>URL</label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://github.com/yourusername"
                    required
                  />
                </div>
              </div>
              <div className="modal-form-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Save' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
