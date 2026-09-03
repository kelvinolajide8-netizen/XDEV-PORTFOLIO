import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import ProjectCard from '../components/ProjectCard'
import ImageGallery from '../components/ImageGallery'
import { Search } from 'lucide-react'

const PROJECTS_PER_PAGE = 6

export default function Projects() {
  const [allProjects, setAllProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterLang, setFilterLang] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [galleryProject, setGalleryProject] = useState(null)

  useEffect(() => {
    loadProjects()
  }, [])

  async function loadProjects() {
    const { data } = await supabase
      .from('projects')
      .select('*, project_languages(language), project_images(image_url)')
      .order('created_at', { ascending: false })

    const mapped = (data || []).map((p) => ({
      ...p,
      languages: p.project_languages?.map((l) => l.language) || [],
      images: p.project_images?.map((i) => i.image_url) || [],
    }))
    setAllProjects(mapped)
    setLoading(false)
  }

  const allLanguages = useMemo(() => {
    const set = new Set()
    allProjects.forEach((p) => p.languages.forEach((l) => set.add(l)))
    return Array.from(set).sort()
  }, [allProjects])

  const filtered = useMemo(() => {
    return allProjects.filter((p) => {
      const matchesSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      const matchesLang = filterLang === 'all' || p.languages.includes(filterLang)
      return matchesSearch && matchesLang
    })
  }, [allProjects, search, filterLang])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PROJECTS_PER_PAGE))
  const currentPageClamped = Math.min(currentPage, totalPages)
  const paginated = filtered.slice(
    (currentPageClamped - 1) * PROJECTS_PER_PAGE,
    currentPageClamped * PROJECTS_PER_PAGE
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [search, filterLang])

  return (
    <div className="section" style={{ paddingTop: '8rem' }}>
      <h2 className="section-title">All <span>Projects</span></h2>

      <div className="projects-page-controls">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="filter-select"
          value={filterLang}
          onChange={(e) => setFilterLang(e.target.value)}
        >
          <option value="all">All Technologies</option>
          {allLanguages.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="loading">Loading projects...</p>
      ) : paginated.length === 0 ? (
        <p className="no-results">No projects found. Try adjusting your search or filters.</p>
      ) : (
        <div className="projects-grid">
          {paginated.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onImageClick={setGalleryProject}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            disabled={currentPageClamped === 1}
            onClick={() => setCurrentPage(currentPageClamped - 1)}
          >
            ← Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`page-btn ${page === currentPageClamped ? 'active' : ''}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="page-btn"
            disabled={currentPageClamped === totalPages}
            onClick={() => setCurrentPage(currentPageClamped + 1)}
          >
            Next →
          </button>
        </div>
      )}

      {galleryProject && (
        <ImageGallery project={galleryProject} onClose={() => setGalleryProject(null)} />
      )}
    </div>
  )
}
