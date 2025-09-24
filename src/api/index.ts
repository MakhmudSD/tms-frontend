import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { LoginRequest, LoginResponse, User, Driver, Order, CreateDriverRequest, UpdateDriverRequest, CreateOrderRequest, UpdateOrderRequest, AssignDriverRequest } from '../types'

class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:3000',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor to handle auth errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('access_token')
          localStorage.removeItem('user')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response: AxiosResponse<LoginResponse> = await this.api.post('/auth/login', credentials)
    return response.data
  }

  async getProfile(): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get('/auth/profile')
    return response.data
  }

  // Users endpoints
  async getUsers(): Promise<User[]> {
    const response: AxiosResponse<User[]> = await this.api.get('/users')
    return response.data
  }

  async getUser(id: number): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get(`/users/${id}`)
    return response.data
  }

  async createUser(userData: any): Promise<User> {
    const response: AxiosResponse<User> = await this.api.post('/users', userData)
    return response.data
  }

  async updateUser(id: number, userData: any): Promise<User> {
    const response: AxiosResponse<User> = await this.api.patch(`/users/${id}`, userData)
    return response.data
  }

  async deleteUser(id: number): Promise<void> {
    await this.api.delete(`/users/${id}`)
  }

  // Drivers endpoints
  async getDrivers(): Promise<Driver[]> {
    const response: AxiosResponse<Driver[]> = await this.api.get('/drivers')
    return response.data
  }

  async getAvailableDrivers(): Promise<Driver[]> {
    const response: AxiosResponse<Driver[]> = await this.api.get('/drivers/available')
    return response.data
  }

  async getDriver(id: number): Promise<Driver> {
    const response: AxiosResponse<Driver> = await this.api.get(`/drivers/${id}`)
    return response.data
  }

  async createDriver(driverData: CreateDriverRequest): Promise<Driver> {
    const response: AxiosResponse<Driver> = await this.api.post('/drivers', driverData)
    return response.data
  }

  async updateDriver(id: number, driverData: UpdateDriverRequest): Promise<Driver> {
    const response: AxiosResponse<Driver> = await this.api.patch(`/drivers/${id}`, driverData)
    return response.data
  }

  async updateDriverStatus(id: number, status: string): Promise<Driver> {
    const response: AxiosResponse<Driver> = await this.api.patch(`/drivers/${id}/status`, { status })
    return response.data
  }

  async deleteDriver(id: number): Promise<void> {
    await this.api.delete(`/drivers/${id}`)
  }

  async getDriverStats(id: number): Promise<any> {
    const response: AxiosResponse<any> = await this.api.get(`/drivers/${id}/stats`)
    return response.data
  }

  // Orders endpoints
  async getOrders(): Promise<Order[]> {
    const response: AxiosResponse<Order[]> = await this.api.get('/orders')
    return response.data
  }

  async getOrdersByStatus(status: string): Promise<Order[]> {
    const response: AxiosResponse<Order[]> = await this.api.get(`/orders/status/${status}`)
    return response.data
  }

  async getOrdersByDriver(driverId: number): Promise<Order[]> {
    const response: AxiosResponse<Order[]> = await this.api.get(`/orders/driver/${driverId}`)
    return response.data
  }

  async getOrder(id: number): Promise<Order> {
    const response: AxiosResponse<Order> = await this.api.get(`/orders/${id}`)
    return response.data
  }

  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    const response: AxiosResponse<Order> = await this.api.post('/orders', orderData)
    return response.data
  }

  async updateOrder(id: number, orderData: UpdateOrderRequest): Promise<Order> {
    const response: AxiosResponse<Order> = await this.api.patch(`/orders/${id}`, orderData)
    return response.data
  }

  async assignDriver(orderId: number, driverData: AssignDriverRequest): Promise<Order> {
    const response: AxiosResponse<Order> = await this.api.patch(`/orders/${orderId}/assign-driver`, driverData)
    return response.data
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const response: AxiosResponse<Order> = await this.api.patch(`/orders/${id}/status`, { status })
    return response.data
  }

  async deleteOrder(id: number): Promise<void> {
    await this.api.delete(`/orders/${id}`)
  }

  async getOrderStats(): Promise<any> {
    const response: AxiosResponse<any> = await this.api.get('/orders/stats')
    return response.data
  }

  async getOrdersForTracking(): Promise<Order[]> {
    const response: AxiosResponse<Order[]> = await this.api.get('/orders/tracking')
    return response.data
  }
}

export default new ApiService()
