// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('sc_token')
    if (token) {
      authAPI.profile()
        .then(setUser)
        .catch(() => localStorage.removeItem('sc_token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (credentials) => {
    const { token, user } = await authAPI.login(credentials)
    localStorage.setItem('sc_token', token)
    setUser(user)
  }

  const signup = async (data) => {
    const { token, user } = await authAPI.signup(data)
    localStorage.setItem('sc_token', token)
    setUser(user)
  }

  const logout = () => {
    localStorage.removeItem('sc_token')
    setUser(null)
  }

  const updateUser = (data) => {
    setUser(prev => ({ ...prev, ...data }))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
