import { useState } from 'react'
import { useAdminAuth } from '../lib/adminAuth'
import { X, Lock, User } from 'lucide-react'

export default function AdminLogin({ onClose, onSuccess }) {
  const { login } = useAdminAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const success = login(username, password)
    if (success) {
      onSuccess()
    } else {
      setError('Invalid username or password')
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-form" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-form-header">
          <h3>Admin Login</h3>
          <button className="gallery-close" onClick={onClose}><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-form-body">
            <div className="form-group">
              <label>Username</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--light)' }} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  style={{ paddingLeft: '2.5rem' }}
                  autoFocus
                />
              </div>
            </div>
            <div className="form-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--light)' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  required
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>
            {error && (
              <p style={{ color: '#ff5757', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{error}</p>
            )}
          </div>
          <div className="modal-form-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Login</button>
          </div>
        </form>
      </div>
    </div>
  )
}
