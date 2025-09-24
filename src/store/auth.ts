import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api'
import type { User, LoginRequest } from '../types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed properties
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRole = computed(() => user.value?.role_id || null)

  // Initialize store from localStorage
  const initializeAuth = () => {
    const storedToken = localStorage.getItem('access_token')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = JSON.parse(storedUser)
    }
  }

  // Login action
  const login = async (credentials: LoginRequest) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.login(credentials)
      
      token.value = response.access_token
      user.value = {
        ...response.user,
        created_at: response.user.created_at || new Date().toISOString(),
        updated_at: response.user.updated_at || new Date().toISOString(),
      }

      // Store in localStorage
      localStorage.setItem('access_token', response.access_token)
      localStorage.setItem('user', JSON.stringify(response.user))

      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Logout action
  const logout = async () => {
    token.value = null
    user.value = null
    error.value = null

    // Clear localStorage
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
  }

  // Get user profile
  const fetchProfile = async () => {
    if (!token.value) return

    loading.value = true
    error.value = null

    try {
      const profile = await api.getProfile()
      user.value = profile
      localStorage.setItem('user', JSON.stringify(profile))
      return profile
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch profile'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Clear error
  const clearError = () => {
    error.value = null
  }

  return {
    // State
    user,
    token,
    loading,
    error,
    
    // Computed
    isAuthenticated,
    userRole,
    
    // Actions
    initializeAuth,
    login,
    logout,
    fetchProfile,
    clearError,
  }
})
