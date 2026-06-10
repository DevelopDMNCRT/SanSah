import { ref, computed } from 'vue'

const TOKEN_KEY = 'amigo_admin_token'

const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
const admin = ref<{ id: number; username: string; email: string } | null>(null)

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value)

  function setToken(t: string, user: typeof admin.value) {
    token.value = t
    admin.value = user
    localStorage.setItem(TOKEN_KEY, t)
  }

  function clearAuth() {
    token.value = null
    admin.value = null
    localStorage.removeItem(TOKEN_KEY)
  }

  async function login(username: string, password: string) {
    const API_URL = import.meta.env.VITE_API_URL || ''
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: username, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Error al iniciar sesión')
    setToken(data.token, data.user)
    return data.user
  }

  async function verifyToken() {
    if (!token.value) return false
    try {
      const API_URL = import.meta.env.VITE_API_URL || ''
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token.value}` },
      })
      if (!res.ok) { clearAuth(); return false }
      const data = await res.json()
      admin.value = data.user
      return true
    } catch {
      clearAuth()
      return false
    }
  }

  function logout() {
    clearAuth()
  }

  return { token, admin, isAuthenticated, login, logout, verifyToken }
}
