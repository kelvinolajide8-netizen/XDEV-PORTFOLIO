import { createContext, useContext, useState, useEffect } from 'react'

const AdminAuthContext = createContext(null)

const STORAGE_KEY = 'xdev_admin_auth'

export function AdminAuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (stored === 'true') setIsAuthenticated(true)
  }, [])

  function login(username, password) {
    if (username === 'admin' && password === 'admin') {
      setIsAuthenticated(true)
      sessionStorage.setItem(STORAGE_KEY, 'true')
      return true
    }
    return false
  }

  function logout() {
    setIsAuthenticated(false)
    sessionStorage.removeItem(STORAGE_KEY)
  }

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
