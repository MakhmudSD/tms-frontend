import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api'
import type { Order, CreateOrderRequest, UpdateOrderRequest, AssignDriverRequest } from '../types'

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref<Order[]>([])
  const trackingOrders = ref<Order[]>([])
  const currentOrder = ref<Order | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Fetch all orders
  const fetchOrders = async () => {
    loading.value = true
    error.value = null

    try {
      orders.value = await api.getOrders()
      return orders.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch orders'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Fetch orders by status
  const fetchOrdersByStatus = async (status: string) => {
    loading.value = true
    error.value = null

    try {
      const statusOrders = await api.getOrdersByStatus(status)
      return statusOrders
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch orders by status'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Fetch orders by driver
  const fetchOrdersByDriver = async (driverId: number) => {
    loading.value = true
    error.value = null

    try {
      const driverOrders = await api.getOrdersByDriver(driverId)
      return driverOrders
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch orders by driver'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Fetch orders for tracking
  const fetchTrackingOrders = async () => {
    loading.value = true
    error.value = null

    try {
      trackingOrders.value = await api.getOrdersForTracking()
      return trackingOrders.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch tracking orders'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Fetch single order
  const fetchOrder = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      currentOrder.value = await api.getOrder(id)
      return currentOrder.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch order'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Create order
  const createOrder = async (orderData: CreateOrderRequest) => {
    loading.value = true
    error.value = null

    try {
      const newOrder = await api.createOrder(orderData)
      orders.value.unshift(newOrder) // Add to beginning of array
      return newOrder
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create order'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update order
  const updateOrder = async (id: number, orderData: UpdateOrderRequest) => {
    loading.value = true
    error.value = null

    try {
      const updatedOrder = await api.updateOrder(id, orderData)
      
      // Update in orders array
      const index = orders.value.findIndex(o => o.id === id)
      if (index !== -1) {
        orders.value[index] = updatedOrder
      }

      // Update current order if it's the same
      if (currentOrder.value?.id === id) {
        currentOrder.value = updatedOrder
      }

      return updatedOrder
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update order'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Assign driver to order
  const assignDriver = async (orderId: number, driverData: AssignDriverRequest) => {
    loading.value = true
    error.value = null

    try {
      const updatedOrder = await api.assignDriver(orderId, driverData)
      
      // Update in orders array
      const index = orders.value.findIndex(o => o.id === orderId)
      if (index !== -1) {
        orders.value[index] = updatedOrder
      }

      // Update current order if it's the same
      if (currentOrder.value?.id === orderId) {
        currentOrder.value = updatedOrder
      }

      // Refresh tracking orders
      await fetchTrackingOrders()

      return updatedOrder
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to assign driver'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update order status
  const updateOrderStatus = async (id: number, status: string) => {
    loading.value = true
    error.value = null

    try {
      const updatedOrder = await api.updateOrderStatus(id, status)
      
      // Update in orders array
      const index = orders.value.findIndex(o => o.id === id)
      if (index !== -1) {
        orders.value[index] = updatedOrder
      }

      // Update current order if it's the same
      if (currentOrder.value?.id === id) {
        currentOrder.value = updatedOrder
      }

      // Refresh tracking orders if status affects tracking
      if (['assigned', 'in_progress', 'completed'].includes(status)) {
        await fetchTrackingOrders()
      }

      return updatedOrder
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update order status'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete order
  const deleteOrder = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      await api.deleteOrder(id)
      
      // Remove from orders array
      orders.value = orders.value.filter(o => o.id !== id)
      
      // Clear current order if it's the same
      if (currentOrder.value?.id === id) {
        currentOrder.value = null
      }

      // Refresh tracking orders
      await fetchTrackingOrders()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete order'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get order statistics
  const getOrderStats = async () => {
    loading.value = true
    error.value = null

    try {
      return await api.getOrderStats()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch order stats'
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
    orders,
    trackingOrders,
    currentOrder,
    loading,
    error,
    
    // Actions
    fetchOrders,
    fetchOrdersByStatus,
    fetchOrdersByDriver,
    fetchTrackingOrders,
    fetchOrder,
    createOrder,
    updateOrder,
    assignDriver,
    updateOrderStatus,
    deleteOrder,
    getOrderStats,
    clearError,
  }
})
