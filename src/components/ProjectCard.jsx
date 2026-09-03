import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export function getProjectEmoji(title) {
  const emojis = {
    'e-commerce': '🛒', 'analytics': '📊', 'chat': '💬', 'ai': '🤖',
    'eco': '🌱', 'music': '🎵', 'task': '📋', 'social': '👥',
    'weather': '🌤️', 'game': '🎮', 'blog': '📝', 'portfolio': '💼',
  }
  const lower = (title || '').toLowerCase()
  for (const key of Object.keys(emojis)) {
    if (lower.includes(key)) return emojis[key]
  }
  return '🚀'
}

export default function ProjectCard({ project, onImageClick }) {
  const tags = project.languages || []

  const handleDemoClick = (e) => {
    if (!project.live_demo_url || project.live_demo_url === '#') {
      e.preventDefault()
    }
  }

  const handleCodeClick = (e) => {
    if (!project.github_url || project.github_url === '#') {
      e.preventDefault()
    }
  }

  return (
    <div className="project-card">
      <div
        className="project-image"
        onClick={() => onImageClick && onImageClick(project)}
      >
        {project.thumbnail_url ? (
          <img src={project.thumbnail_url} alt={project.title} />
        ) : (
          <span>{getProjectEmoji(project.title)}</span>
        )}
      </div>
      <div className="project-content">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        {tags.length > 0 && (
          <div className="project-tags">
            {tags.map((tag, i) => (
              <span key={i} className="tag">{tag}</span>
            ))}
          </div>
        )}
        <div className="project-links">
          <a
            href={project.live_demo_url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="project-link primary"
            onClick={handleDemoClick}
          >
            Live Demo
          </a>
          <a
            href={project.github_url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="project-link secondary"
            onClick={handleCodeClick}
          >
            Code
          </a>
        </div>
      </div>
    </div>
  )
}
