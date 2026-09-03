import { NavLink, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkClass = ({ isActive }) => isActive ? 'active' : ''

  return (
    <nav className="nav" style={{ boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.3)' : '0 2px 10px rgba(0,0,0,0.1)' }}>
      <div className="nav-container">
        <Link to="/" className="logo">
          <span className="logo-x">X</span><span className="logo-dev">dev</span>
        </Link>
        <ul className={`nav-links ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
          <li><NavLink to="/" className={linkClass} end>Home</NavLink></li>
          <li><NavLink to="/projects" className={linkClass}>Projects</NavLink></li>
          <li><a href="/#about">About</a></li>
          <li><a href="/#contact">Contact</a></li>
        </ul>
        <div className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span><span></span><span></span>
        </div>
      </div>
    </nav>
  )
}
