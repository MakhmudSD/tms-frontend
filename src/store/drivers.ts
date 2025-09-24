import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api'
import type { Driver, CreateDriverRequest, UpdateDriverRequest } from '../types'

export const useDriversStore = defineStore('drivers', () => {
  const drivers = ref<Driver[]>([])
  const availableDrivers = ref<Driver[]>([])
  const currentDriver = ref<Driver | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Fetch all drivers
  const fetchDrivers = async () => {
    loading.value = true
    error.value = null

    try {
      drivers.value = await api.getDrivers()
      return drivers.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch drivers'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Fetch available drivers
  const fetchAvailableDrivers = async () => {
    loading.value = true
    error.value = null

    try {
      availableDrivers.value = await api.getAvailableDrivers()
      return availableDrivers.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch available drivers'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Fetch single driver
  const fetchDriver = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      currentDriver.value = await api.getDriver(id)
      return currentDriver.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch driver'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Create driver
  const createDriver = async (driverData: CreateDriverRequest) => {
    loading.value = true
    error.value = null

    try {
      const newDriver = await api.createDriver(driverData)
      drivers.value.push(newDriver)
      return newDriver
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create driver'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update driver
  const updateDriver = async (id: number, driverData: UpdateDriverRequest) => {
    loading.value = true
    error.value = null

    try {
      const updatedDriver = await api.updateDriver(id, driverData)
      
      // Update in drivers array
      const index = drivers.value.findIndex(d => d.id === id)
      if (index !== -1) {
        drivers.value[index] = updatedDriver
      }

      // Update current driver if it's the same
      if (currentDriver.value?.id === id) {
        currentDriver.value = updatedDriver
      }

      return updatedDriver
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update driver'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update driver status
  const updateDriverStatus = async (id: number, status: string) => {
    loading.value = true
    error.value = null

    try {
      const updatedDriver = await api.updateDriverStatus(id, status)
      
      // Update in drivers array
      const index = drivers.value.findIndex(d => d.id === id)
      if (index !== -1) {
        drivers.value[index] = updatedDriver
      }

      // Update current driver if it's the same
      if (currentDriver.value?.id === id) {
        currentDriver.value = updatedDriver
      }

      // Refresh available drivers if status changed to/from available
      if (status === 'available' || updatedDriver.status === 'available') {
        await fetchAvailableDrivers()
      }

      return updatedDriver
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update driver status'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete driver
  const deleteDriver = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      await api.deleteDriver(id)
      
      // Remove from drivers array
      drivers.value = drivers.value.filter(d => d.id !== id)
      
      // Clear current driver if it's the same
      if (currentDriver.value?.id === id) {
        currentDriver.value = null
      }

      // Refresh available drivers
      await fetchAvailableDrivers()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete driver'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get driver stats
  const getDriverStats = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      return await api.getDriverStats(id)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch driver stats'
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
    drivers,
    availableDrivers,
    currentDriver,
    loading,
    error,
    
    // Actions
    fetchDrivers,
    fetchAvailableDrivers,
    fetchDriver,
    createDriver,
    updateDriver,
    updateDriverStatus,
    deleteDriver,
    getDriverStats,
    clearError,
  }
})
