import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

export default function AdminTools() {
  const [tools, setTools] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [name, setName] = useState('')
  const [iconUrl, setIconUrl] = useState('')

  useEffect(() => {
    loadTools()
  }, [])

  async function loadTools() {
    const { data } = await supabase.from('tools').select('*').order('name')
    setTools(data || [])
    setLoading(false)
  }

  function handleAdd() {
    setEditing(null)
    setName('')
    setIconUrl('')
    setShowForm(true)
  }

  function handleEdit(tool) {
    setEditing(tool)
    setName(tool.name)
    setIconUrl(tool.icon_url || '')
    setShowForm(true)
  }

  async function handleDelete(tool) {
    if (!confirm(`Delete "${tool.name}"?`)) return
    await supabase.from('tools').delete().eq('id', tool.id)
    loadTools()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (editing) {
      await supabase.from('tools').update({ name, icon_url: iconUrl || null }).eq('id', editing.id)
    } else {
      await supabase.from('tools').insert({ name, icon_url: iconUrl || null })
    }
    setShowForm(false)
    setEditing(null)
    setName('')
    setIconUrl('')
    loadTools()
  }

  return (
    <div>
      <h1 className="admin-page-title">Manage <span>Tools & Technologies</span></h1>
      <button className="admin-add-btn" onClick={handleAdd}>
        <Plus size={18} /> Add Tool
      </button>

      {loading ? (
        <p className="loading">Loading tools...</p>
      ) : tools.length === 0 ? (
        <p className="no-results">No tools yet. Click "Add Tool" to create one.</p>
      ) : (
        <div className="tools-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
          {tools.map((tool) => (
            <div key={tool.id} className="tool-item" style={{ justifyContent: 'space-between', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {tool.icon_url ? (
                  <img src={tool.icon_url} alt={tool.name} style={{ width: 24, height: 24, borderRadius: 4 }} />
                ) : (
                  <div className="tool-icon" />
                )}
                <span>{tool.name}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="admin-action-btn edit" onClick={() => handleEdit(tool)}>
                  <Pencil size={14} />
                </button>
                <button className="admin-action-btn delete" onClick={() => handleDelete(tool)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-form" onClick={(e) => e.stopPropagation()}>
            <div className="modal-form-header">
              <h3>{editing ? 'Edit Tool' : 'Add Tool'}</h3>
              <button className="gallery-close" onClick={() => setShowForm(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-form-body">
                <div className="form-group">
                  <label>Tool Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Docker" required />
                </div>
                <div className="form-group">
                  <label>Icon URL (optional)</label>
                  <input type="url" value={iconUrl} onChange={(e) => setIconUrl(e.target.value)} placeholder="https://example.com/icon.png" />
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
