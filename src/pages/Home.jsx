import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import ScrollReveal from '../components/ScrollReveal'
import ProjectCard from '../components/ProjectCard'
import ImageGallery from '../components/ImageGallery'
import { GitHubIcon, LinkedInIcon, TwitterIcon, InstagramIcon, FacebookIcon } from '../components/SocialIcons'

export default function Home() {
  const [projects, setProjects] = useState([])
  const [tools, setTools] = useState([])
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [galleryProject, setGalleryProject] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const [projRes, toolsRes, langRes] = await Promise.all([
      supabase
        .from('projects')
        .select('*, project_languages(language)')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(6),
      supabase.from('tools').select('*').order('name'),
      supabase.from('project_languages').select('language'),
    ])

    const featured = (projRes.data || []).map((p) => ({
      ...p,
      languages: p.project_languages?.map((l) => l.language) || [],
    }))
    setProjects(featured)
    setTools(toolsRes.data || [])

    // Auto-calculate skills from language frequency
    const langCounts = {}
    ;(langRes.data || []).forEach((row) => {
      langCounts[row.language] = (langCounts[row.language] || 0) + 1
    })

    const totalProjects = projRes.data?.length || 1
    const calculated = Object.entries(langCounts)
      .map(([lang, count]) => ({
        name: lang,
        percent: Math.min(100, Math.round((count / totalProjects) * 100 + 30)),
      }))
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 6)

    setSkills(calculated)
    setLoading(false)
  }

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <p style={{ color: 'var(--secondary)', fontWeight: 500, marginBottom: '0.5rem' }}>
            Hello, I'm
          </p>
          <h1><span>X</span>Dev</h1>
          <p>I build beautiful, functional, and user-friendly web experiences that make a difference.</p>
          <div className="hero-buttons">
            <Link to="/projects" className="btn btn-primary">View My Work</Link>
            <a href="#contact" className="btn btn-secondary">Contact Me</a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section">
        <h2 className="section-title">About <span>Me</span></h2>
        <div className="about">
          <ScrollReveal className="about-image">
            <div className="about-image-placeholder">👨‍💻</div>
            <div className="experience-badge">
              <span className="number">1+</span>
              <span className="text">Years Exp.</span>
            </div>
          </ScrollReveal>
          <ScrollReveal className="about-content">
            <h3>Passionate about creating amazing digital experiences</h3>
            <p>I'm a full-stack developer with a love for clean code and beautiful design. I specialize in building modern web applications that are fast, accessible, and user-friendly.</p>
            <p>When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or enjoying a good cup of coffee while sketching out new ideas.</p>
            <div className="stats">
              <div className="stat-item">
                <h4>{projects.length}+</h4>
                <p>Projects Completed</p>
              </div>
              <div className="stat-item">
                <h4>{projects.length}+</h4>
                <p>Happy Clients</p>
              </div>
              <div className="stat-item">
                <h4>100%</h4>
                <p>Commitment</p>
              </div>
              <div className="stat-item">
                <h4>24/7</h4>
                <p>Support</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section">
        <h2 className="section-title">My <span>Skills</span></h2>
        <div className="skills-container">
          <ScrollReveal className="skill-category">
            <h3>💻 Technical Skills</h3>
            {loading ? (
              <p className="loading">Loading skills...</p>
            ) : skills.length > 0 ? (
              skills.map((skill, i) => (
                <div className="skill-item" key={i}>
                  <div className="skill-header">
                    <span>{skill.name}</span>
                    <span>{skill.percent}%</span>
                  </div>
                  <div className="skill-bar">
                    <div className="skill-progress" style={{ width: `${skill.percent}%` }} />
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--light)' }}>Add projects with languages to auto-calculate skills.</p>
            )}
          </ScrollReveal>

          <ScrollReveal className="skill-category">
            <h3>🛠️ Tools & Technologies</h3>
            <div className="tools-grid">
              {tools.map((tool) => (
                <div className="tool-item" key={tool.id}>
                  <div className="tool-icon" />
                  <span>{tool.name}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section id="projects" className="section">
        <h2 className="section-title">Featured <span>Projects</span></h2>
        {loading ? (
          <p className="loading">Loading projects...</p>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <ScrollReveal key={project.id}>
                <ProjectCard project={project} onImageClick={setGalleryProject} />
              </ScrollReveal>
            ))}
          </div>
        )}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/projects" className="btn btn-secondary">View All Projects</Link>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section">
        <h2 className="section-title">Get In <span>Touch</span></h2>
        <div className="contact-container">
          <ScrollReveal className="contact-info">
            <h3>Contact Information</h3>
            <div className="contact-item">
              <div className="contact-icon">📧</div>
              <div>
                <p>Email</p>
                <p>kelvinolajide8@gmail.com</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">📍</div>
              <div>
                <p>Location</p>
                <p>Osogbo, Osun State.</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">📱</div>
              <div>
                <p>Phone</p>
                <p>+2348145243739</p>
              </div>
            </div>
            <div className="social-links">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub"><GitHubIcon /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn"><LinkedInIcon /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Twitter"><TwitterIcon /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram"><InstagramIcon /></a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook"><FacebookIcon /></a>
            </div>
          </ScrollReveal>

          <ContactForm />
        </div>
      </section>

      {galleryProject && (
        <ImageGallery project={galleryProject} onClose={() => setGalleryProject(null)} />
      )}
    </>
  )
}

function ContactForm() {
  const [notification, setNotification] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setNotification(true)
    e.target.reset()
    setTimeout(() => setNotification(false), 3000)
  }

  return (
    <>
      <ScrollReveal>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" placeholder="Your name" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" placeholder="your@email.com" required />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" placeholder="Your message..." required />
          </div>
          <button type="submit" className="submit-btn">Send Message</button>
        </form>
      </ScrollReveal>
      <div className={`notification ${notification ? 'show' : ''}`}>
        <div className="notification-icon">✓</div>
        <span>Message sent successfully!</span>
      </div>
    </>
  )
}
