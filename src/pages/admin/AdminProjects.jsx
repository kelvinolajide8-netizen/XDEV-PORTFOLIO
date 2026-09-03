import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { getProjectEmoji } from '../../components/ProjectCard'

export default function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadProjects()
  }, [])

  async function loadProjects() {
    const { data } = await supabase
      .from('projects')
      .select('*, project_languages(language), project_images(id, image_url, sort_order)')
      .order('created_at', { ascending: false })

    const mapped = (data || []).map((p) => ({
      ...p,
      languages: p.project_languages?.map((l) => l.language) || [],
      images: p.project_images || [],
    }))
    setProjects(mapped)
    setLoading(false)
  }

  function handleAdd() {
    setEditing(null)
    setShowForm(true)
  }

  function handleEdit(project) {
    setEditing(project)
    setShowForm(true)
  }

  async function handleDelete(project) {
    if (!confirm(`Delete "${project.title}"? This cannot be undone.`)) return

    await supabase.from('project_languages').delete().eq('project_id', project.id)
    await supabase.from('project_images').delete().eq('project_id', project.id)
    await supabase.from('projects').delete().eq('id', project.id)
    loadProjects()
  }

  async function handleSave(formData) {
    const { title, description, thumbnail_url, live_demo_url, github_url, is_featured, languages, images } = formData

    if (editing) {
      await supabase.from('projects').update({
        title, description, thumbnail_url, live_demo_url, github_url, is_featured,
      }).eq('id', editing.id)

      await supabase.from('project_languages').delete().eq('project_id', editing.id)
      if (languages.length > 0) {
        await supabase.from('project_languages').insert(
          languages.map((lang) => ({ project_id: editing.id, language: lang }))
        )
      }

      await supabase.from('project_images').delete().eq('project_id', editing.id)
      if (images.length > 0) {
        await supabase.from('project_images').insert(
          images.map((url, i) => ({ project_id: editing.id, image_url: url, sort_order: i }))
        )
      }
    } else {
      const { data: newProject } = await supabase.from('projects').insert({
        title, description, thumbnail_url, live_demo_url, github_url, is_featured,
      }).select().single()

      if (newProject) {
        if (languages.length > 0) {
          await supabase.from('project_languages').insert(
            languages.map((lang) => ({ project_id: newProject.id, language: lang }))
          )
        }
        if (images.length > 0) {
          await supabase.from('project_images').insert(
            images.map((url, i) => ({ project_id: newProject.id, image_url: url, sort_order: i }))
          )
        }
      }
    }

    setShowForm(false)
    setEditing(null)
    loadProjects()
  }

  return (
    <div>
      <h1 className="admin-page-title">Manage <span>Projects</span></h1>
      <button className="admin-add-btn" onClick={handleAdd}>
        <Plus size={18} /> Add Project
      </button>

      {loading ? (
        <p className="loading">Loading projects...</p>
      ) : projects.length === 0 ? (
        <p className="no-results">No projects yet. Click "Add Project" to create one.</p>
      ) : (
        projects.map((project) => (
          <div className="admin-card" key={project.id}>
            {project.thumbnail_url ? (
              <img src={project.thumbnail_url} alt={project.title} />
            ) : (
              <div className="admin-card-placeholder">{getProjectEmoji(project.title)}</div>
            )}
            <div className="admin-card-info">
              <h4>{project.title} {!project.is_featured && <span style={{ color: 'var(--light)', fontSize: '0.75rem', fontWeight: 400 }}>(not featured)</span>}</h4>
              <p>{project.description}</p>
              <p style={{ marginTop: '0.25rem', fontSize: '0.8rem', color: 'var(--secondary)' }}>
                {project.languages.join(', ') || 'No languages'}
              </p>
            </div>
            <div className="admin-card-actions">
              <button className="admin-action-btn edit" onClick={() => handleEdit(project)}>
                <Pencil size={14} /> Edit
              </button>
              <button className="admin-action-btn delete" onClick={() => handleDelete(project)}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))
      )}

      {showForm && (
        <ProjectForm
          project={editing}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditing(null) }}
        />
      )}
    </div>
  )
}

function ProjectForm({ project, onSave, onCancel }) {
  const [title, setTitle] = useState(project?.title || '')
  const [description, setDescription] = useState(project?.description || '')
  const [thumbnailUrl, setThumbnailUrl] = useState(project?.thumbnail_url || '')
  const [liveDemoUrl, setLiveDemoUrl] = useState(project?.live_demo_url || '')
  const [githubUrl, setGithubUrl] = useState(project?.github_url || '')
  const [isFeatured, setIsFeatured] = useState(project?.is_featured ?? true)
  const [languages, setLanguages] = useState(project?.languages || [])
  const [images, setImages] = useState(project?.images?.map((i) => i.image_url) || [])
  const [langInput, setLangInput] = useState('')
  const [imgInput, setImgInput] = useState('')

  function addLanguage(e) {
    e?.preventDefault()
    const val = langInput.trim()
    if (val && !languages.includes(val)) {
      setLanguages([...languages, val])
    }
    setLangInput('')
  }

  function removeLanguage(lang) {
    setLanguages(languages.filter((l) => l !== lang))
  }

  function addImage(e) {
    e?.preventDefault()
    const val = imgInput.trim()
    if (val) {
      setImages([...images, val])
    }
    setImgInput('')
  }

  function removeImage(idx) {
    setImages(images.filter((_, i) => i !== idx))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSave({ title, description, thumbnail_url: thumbnailUrl, live_demo_url: liveDemoUrl, github_url: githubUrl, is_featured: isFeatured, languages, images })
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-form" onClick={(e) => e.stopPropagation()}>
        <div className="modal-form-header">
          <h3>{project ? 'Edit Project' : 'Add Project'}</h3>
          <button className="gallery-close" onClick={onCancel}><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-form-body">
            <div className="form-group">
              <label>Project Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="My Awesome Project" required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Project description..." required />
            </div>
            <div className="form-group">
              <label>Thumbnail URL</label>
              <input type="url" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} placeholder="https://example.com/thumbnail.jpg" />
            </div>
            <div className="form-group">
              <label>Live Demo URL</label>
              <input type="url" value={liveDemoUrl} onChange={(e) => setLiveDemoUrl(e.target.value)} placeholder="https://my-project.demo.com" />
            </div>
            <div className="form-group">
              <label>GitHub Code URL</label>
              <input type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/user/repo" />
            </div>
            <div className="form-group">
              <label>Languages / Technologies</label>
              <div className="language-tags-input">
                {languages.map((lang) => (
                  <span key={lang} className="language-tag">
                    {lang}
                    <button type="button" onClick={() => removeLanguage(lang)}>×</button>
                  </span>
                ))}
                <input
                  type="text"
                  value={langInput}
                  onChange={(e) => setLangInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLanguage() } }}
                  placeholder="Type and press Enter..."
                />
              </div>
            </div>
            <div className="form-group">
              <label>Additional Images</label>
              <div className="language-tags-input">
                {images.map((img, idx) => (
                  <span key={idx} className="language-tag">
                    Image {idx + 1}
                    <button type="button" onClick={() => removeImage(idx)}>×</button>
                  </span>
                ))}
                <input
                  type="text"
                  value={imgInput}
                  onChange={(e) => setImgInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addImage() } }}
                  placeholder="Paste image URL and press Enter..."
                />
              </div>
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  style={{ width: 'auto' }}
                />
                Featured on home page
              </label>
            </div>
          </div>
          <div className="modal-form-footer">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn btn-primary">{project ? 'Save Changes' : 'Create Project'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
