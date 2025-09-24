// User types
export interface User {
  user_id: number
  login_id: string
  user_name: string
  role_id?: number
  email?: string
  phone_number?: string
  status_code?: string
  created_at: string
  updated_at: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  access_token: string
  user: {
    updated_at: string
    created_at: string
    user_id: number
    login_id: string
    user_name: string
    role_id?: number
    email?: string
    phone_number?: string
    status_code?: string
  }
}

// Driver types
export interface Driver {
  id: number
  name: string
  phone: string
  vehicle: string
  licenseNumber?: string
  status: 'available' | 'busy' | 'offline'
  email?: string
  address?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  orders?: Order[]
}

export interface CreateDriverRequest {
  name: string
  phone: string
  vehicle: string
  licenseNumber?: string
  status?: string
  email?: string
  address?: string
}

export interface UpdateDriverRequest extends Partial<CreateDriverRequest> {}

// Order types
export type OrderStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
export type OrderPriority = 'low' | 'normal' | 'high' | 'urgent'

export interface Order {
  id: number
  customerName: string
  customerPhone: string
  pickupLocation: string
  dropoffLocation: string
  status: OrderStatus
  priority: OrderPriority
  description?: string
  estimatedFare?: number
  actualFare?: number
  scheduledPickupTime?: string
  actualPickupTime?: string
  actualDropoffTime?: string
  driverId?: number
  driver?: Driver
  createdAt: string
  updatedAt: string
}

export interface CreateOrderRequest {
  customerName: string
  customerPhone: string
  pickupLocation: string
  dropoffLocation: string
  priority?: string
  description?: string
  estimatedFare?: number
  scheduledPickupTime?: string
}

export interface UpdateOrderRequest extends Partial<CreateOrderRequest> {}

export interface AssignDriverRequest {
  driverId: number
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}
