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

  // Users endpoints - Using database endpoints for real data
  async getUsers(): Promise<User[]> {
    const response: AxiosResponse<{success: boolean, message: string, data: User[]}> = await this.api.get('/database/users')
    return response.data.data
  }

  async getUser(id: number): Promise<User> {
    const response: AxiosResponse<{success: boolean, message: string, data: User}> = await this.api.get(`/database/users/${id}`)
    return response.data.data
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

  // Drivers endpoints - Using database endpoints for real data
  async getDrivers(): Promise<Driver[]> {
    const response: AxiosResponse<{success: boolean, message: string, data: Driver[]}> = await this.api.get('/database/drivers')
    return response.data.data
  }

  async getAvailableDrivers(): Promise<Driver[]> {
    // Filter available drivers from all drivers
    const allDrivers = await this.getDrivers()
    return allDrivers.filter(driver => driver.status === 'available')
  }

  async getDriver(id: number): Promise<Driver> {
    const response: AxiosResponse<{success: boolean, message: string, data: Driver}> = await this.api.get(`/database/drivers/${id}`)
    return response.data.data
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

  // Orders endpoints - Using database endpoints for real data
  async getOrders(): Promise<Order[]> {
    const response: AxiosResponse<{success: boolean, message: string, data: Order[]}> = await this.api.get('/database/orders')
    return response.data.data
  }

  async getOrdersByStatus(status: string): Promise<Order[]> {
    const response: AxiosResponse<{success: boolean, message: string, data: Order[]}> = await this.api.get(`/database/orders/status/${status}`)
    return response.data.data
  }

  async getOrdersByDriver(driverId: number): Promise<Order[]> {
    const response: AxiosResponse<{success: boolean, message: string, data: Order[]}> = await this.api.get(`/database/orders/driver/${driverId}`)
    return response.data.data
  }

  async getOrder(id: number): Promise<Order> {
    const response: AxiosResponse<{success: boolean, message: string, data: Order}> = await this.api.get(`/database/orders/${id}`)
    return response.data.data
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

  // Database statistics endpoint
  async getDatabaseStats(): Promise<any> {
    const response: AxiosResponse<{success: boolean, message: string, data: any}> = await this.api.get('/database/stats')
    return response.data.data
  }

  // Database connection status
  async getDatabaseStatus(): Promise<any> {
    const response: AxiosResponse<{success: boolean, message: string, data: any}> = await this.api.get('/database/status')
    return response.data.data
  }

  // Korean TMS endpoints
  async getKoreanTmsStats(): Promise<any> {
    const response: AxiosResponse<{success: boolean, message: string, data: any}> = await this.api.get('/korean-tms/stats')
    return response.data.data
  }

  async getKoreanBranches(): Promise<any[]> {
    const response: AxiosResponse<{success: boolean, message: string, data: any[]}> = await this.api.get('/korean-tms/branches')
    return response.data.data
  }

  async createKoreanBranch(branchData: any): Promise<any> {
    const response: AxiosResponse<{success: boolean, message: string, data: any}> = await this.api.post('/korean-tms/branches', branchData)
    return response.data.data
  }

  async getKoreanClients(): Promise<any[]> {
    const response: AxiosResponse<{success: boolean, message: string, data: any[]}> = await this.api.get('/korean-tms/clients')
    return response.data.data
  }

  async createKoreanClient(clientData: any): Promise<any> {
    const response: AxiosResponse<{success: boolean, message: string, data: any}> = await this.api.post('/korean-tms/clients', clientData)
    return response.data.data
  }

  async getKoreanAssets(): Promise<any[]> {
    const response: AxiosResponse<{success: boolean, message: string, data: any[]}> = await this.api.get('/korean-tms/assets')
    return response.data.data
  }

  async getKoreanAssetsByStatus(status: string): Promise<any[]> {
    const response: AxiosResponse<{success: boolean, message: string, data: any[]}> = await this.api.get(`/korean-tms/assets/status/${status}`)
    return response.data.data
  }

  async createKoreanAsset(assetData: any): Promise<any> {
    const response: AxiosResponse<{success: boolean, message: string, data: any}> = await this.api.post('/korean-tms/assets', assetData)
    return response.data.data
  }

  async updateKoreanAssetStatus(assetId: number, status: string): Promise<any> {
    const response: AxiosResponse<{success: boolean, message: string, data: any}> = await this.api.put(`/korean-tms/assets/${assetId}/status`, { status })
    return response.data.data
  }

  async getKoreanWaypoints(): Promise<any[]> {
    const response: AxiosResponse<{success: boolean, message: string, data: any[]}> = await this.api.get('/korean-tms/waypoints')
    return response.data.data
  }

  async createKoreanWaypoint(waypointData: any): Promise<any> {
    const response: AxiosResponse<{success: boolean, message: string, data: any}> = await this.api.post('/korean-tms/waypoints', waypointData)
    return response.data.data
  }

  async getKoreanSettlements(): Promise<any[]> {
    const response: AxiosResponse<{success: boolean, message: string, data: any[]}> = await this.api.get('/korean-tms/settlements')
    return response.data.data
  }

  async getKoreanSettlementsByStatus(status: string): Promise<any[]> {
    const response: AxiosResponse<{success: boolean, message: string, data: any[]}> = await this.api.get(`/korean-tms/settlements/status/${status}`)
    return response.data.data
  }

  async createKoreanSettlement(settlementData: any): Promise<any> {
    const response: AxiosResponse<{success: boolean, message: string, data: any}> = await this.api.post('/korean-tms/settlements', settlementData)
    return response.data.data
  }

  async getKoreanDailyStats(date?: string): Promise<any> {
    const url = date ? `/korean-tms/daily-stats?date=${date}` : '/korean-tms/daily-stats'
    const response: AxiosResponse<{success: boolean, message: string, data: any}> = await this.api.get(url)
    return response.data.data
  }

  // Emergency Management endpoints
  async getEmergencies(): Promise<any[]> {
    const response: AxiosResponse<{success: boolean, message: string, data: any[]}> = await this.api.get('/korean-tms/emergencies')
    return response.data.data
  }

  async getEmergencyStats(): Promise<any> {
    const response: AxiosResponse<{success: boolean, message: string, data: any}> = await this.api.get('/korean-tms/emergencies/stats')
    return response.data.data
  }

  async getEmergenciesByStatus(status: string): Promise<any[]> {
    const response: AxiosResponse<{success: boolean, message: string, data: any[]}> = await this.api.get(`/korean-tms/emergencies/status/${status}`)
    return response.data.data
  }

  async getEmergency(id: number): Promise<any> {
    const response: AxiosResponse<{success: boolean, message: string, data: any}> = await this.api.get(`/korean-tms/emergencies/${id}`)
    return response.data.data
  }

  async createEmergency(emergencyData: any): Promise<any> {
    const response: AxiosResponse<{success: boolean, message: string, data: any}> = await this.api.post('/korean-tms/emergencies', emergencyData)
    return response.data.data
  }

  async updateEmergency(id: number, emergencyData: any): Promise<any> {
    const response: AxiosResponse<{success: boolean, message: string, data: any}> = await this.api.put(`/korean-tms/emergencies/${id}`, emergencyData)
    return response.data.data
  }

  async deleteEmergency(id: number): Promise<void> {
    await this.api.delete(`/korean-tms/emergencies/${id}`)
  }

}

export default new ApiService()
