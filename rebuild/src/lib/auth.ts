import { useState, useEffect } from 'react'

export interface User {
  id: string
  email: string
  name: string
  plan: 'free' | 'pro'
}

const STORAGE_KEY = 'domfindr_auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setIsLoaded(true)
  }, [])

  const login = (email: string, password: string): boolean => {
    if (email === 'demo@web-library.net' && password === 'demo123') {
      const user: User = { id: 'demo', email, name: 'Demo User', plan: 'pro' }
      setUser(user)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      return true
    }
    const stored = localStorage.getItem('domfindr_users')
    const users = stored ? JSON.parse(stored) : []
    const found = users.find((u: any) => u.email === email && u.password === password)
    if (found) {
      const user: User = { id: found.id, email: found.email, name: found.name, plan: found.plan }
      setUser(user)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      return true
    }
    return false
  }

  const register = (email: string, password: string, name: string): boolean => {
    const stored = localStorage.getItem('domfindr_users')
    const users = stored ? JSON.parse(stored) : []
    if (users.find((u: any) => u.email === email)) return false
    const newUser = { id: crypto.randomUUID(), email, password, name, plan: 'free' as const }
    users.push(newUser)
    localStorage.setItem('domfindr_users', JSON.stringify(users))
    const user: User = { id: newUser.id, email, name, plan: 'free' }
    setUser(user)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return { user, isLoaded, login, register, logout, isLoggedIn: !!user, isPro: user?.plan === 'pro' }
}

export function getAuthUser(): User | null {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return null
  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}
