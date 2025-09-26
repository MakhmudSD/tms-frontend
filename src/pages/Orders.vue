<template>
  <div class="orders-page">
    <!-- Modern Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-title">
          <h1>주문 관리</h1>
          <p class="subtitle">Order Management System</p>
        </div>
        <button @click="openCreateModal" class="create-btn">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          새 주문 등록
        </button>
      </div>
    </div>

    <!-- Modern Stats Cards -->
    <div class="stats-container">
      <div class="stat-card" v-for="stat in statsData" :key="stat.key">
        <div class="stat-icon" :class="stat.iconClass">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path :d="stat.iconPath"></path>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>

    <!-- Modern Filters -->
    <div class="filters-container">
      <div class="filters-header">
        <h3>주문 목록</h3>
        <div class="filter-actions">
          <button class="filter-btn" @click="clearFilters">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="3,6 5,6 21,6"></polyline>
              <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
            </svg>
            필터 초기화
          </button>
        </div>
      </div>
      
      <div class="filters-grid">
        <div class="filter-group">
          <label>고객</label>
          <select v-model="filters.client" class="modern-select">
            <option value="">전체 고객</option>
            <option value="김고객">김고객</option>
            <option value="이고객">이고객</option>
            <option value="박고객">박고객</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>상태</label>
          <select v-model="filters.dispatchStatus" class="modern-select">
            <option value="">전체 상태</option>
            <option value="대기중">대기중</option>
            <option value="배정됨">배정됨</option>
            <option value="운송중">운송중</option>
            <option value="완료">완료</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>화주</label>
          <input 
            v-model="filters.shipper" 
            type="text" 
            placeholder="화주명 검색" 
            class="modern-input"
          />
        </div>
        
        <div class="filter-group">
          <label>상품명</label>
          <input 
            v-model="filters.productName" 
            type="text" 
            placeholder="상품명 검색" 
            class="modern-input"
          />
        </div>
      </div>
    </div>

    <!-- Modern Table -->
    <div class="table-container">
      <div class="table-header">
        <div class="table-actions">
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              :checked="selectedOrders.length === filteredOrders.length && filteredOrders.length > 0"
              @change="selectAllOrders"
            />
            <span class="checkmark"></span>
            전체 선택
          </label>
          <span class="selected-count" v-if="selectedOrders.length > 0">
            {{ selectedOrders.length }}개 선택됨
          </span>
        </div>
      </div>
      
      <div class="table-wrapper">
        <table class="modern-table">
          <thead>
            <tr>
              <th class="checkbox-col"></th>
              <th>고객 정보</th>
              <th>화주</th>
              <th>상품명</th>
              <th>적재지</th>
              <th>하역지</th>
              <th>상태</th>
              <th class="actions-col">관리</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="order in filteredOrders" :key="order.id">
              <tr class="table-row" :class="{ expanded: expandedOrders.includes(order.id) }">
                <td class="checkbox-col">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      :checked="selectedOrders.includes(order.id)"
                      @change="toggleOrderSelection(order.id)"
                    />
                    <span class="checkmark"></span>
                  </label>
                </td>
                
                <td class="customer-cell">
                  <div class="customer-info">
                    <div class="customer-avatar">
                      {{ order.customerName.charAt(0) }}
                    </div>
                    <div class="customer-details">
                      <div class="customer-name">{{ order.customerName }}</div>
                      <div class="customer-phone">{{ order.customerPhone }}</div>
                    </div>
                  </div>
                </td>
                
                <td class="shipper-cell">
                  <span class="shipper-name">{{ order.shipper || '화주 정보 없음' }}</span>
                </td>
                
                <td class="product-cell">
                  <span class="product-name">{{ order.productName || '상품 정보 없음' }}</span>
                </td>
                
                <td class="location-cell">
                  <div class="location-info">
                    <svg class="location-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span class="location-text">{{ order.pickupLocation }}</span>
                  </div>
                </td>
                
                <td class="location-cell">
                  <div class="location-info">
                    <svg class="location-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span class="location-text">{{ order.dropoffLocation }}</span>
                  </div>
                </td>
                
                <td class="status-cell">
                  <span :class="['status-badge', `status-${order.status}`]">
                    {{ getKoreanStatusText(order.status) }}
                  </span>
                </td>
                
                <td class="actions-cell">
                  <div class="action-buttons">
                    <button @click="toggleOrderExpansion(order.id)" class="action-btn expand-btn">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="6,9 12,15 18,9"></polyline>
                      </svg>
                    </button>
                    <button @click="openEditModal(order)" class="action-btn edit-btn">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="m18.5 2.5 a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button @click="viewOrderDetails(order)" class="action-btn view-btn">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              
              <!-- Expanded Details -->
              <tr v-if="expandedOrders.includes(order.id)" class="expanded-details">
                <td colspan="8">
                  <div class="order-details-panel">
                    <div class="details-grid">
                      <div class="detail-card">
                        <h4>주문 정보</h4>
                        <div class="detail-list">
                          <div class="detail-item">
                            <span class="label">주문 ID</span>
                            <span class="value">#{{ order.id }}</span>
                          </div>
                          <div class="detail-item">
                            <span class="label">우선순위</span>
                            <span :class="['priority-badge', `priority-${order.priority}`]">
                              {{ order.priority }}
                            </span>
                          </div>
                          <div class="detail-item">
                            <span class="label">예상 요금</span>
                            <span class="value">{{ formatCurrency(order.estimatedFare) }}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div class="detail-card">
                        <h4>운송 정보</h4>
                        <div class="detail-list">
                          <div class="detail-item">
                            <span class="label">배정된 운전자</span>
                            <span class="value">{{ order.driver ? order.driver.name : '미배정' }}</span>
                          </div>
                          <div class="detail-item">
                            <span class="label">차량 정보</span>
                            <span class="value">{{ order.driver ? order.driver.vehicle : '미배정' }}</span>
                          </div>
                          <div class="detail-item">
                            <span class="label">예상 픽업 시간</span>
                            <span class="value">{{ order.scheduledPickupTime ? formatDate(order.scheduledPickupTime) : '미정' }}</span>
                          </div>
                          <div class="detail-item">
                            <span class="label">상태 관리</span>
                            <select v-model="order.status" @change="updateOrderStatus(order)" class="status-select">
                              <option value="pending">대기중</option>
                              <option value="assigned">배정됨</option>
                              <option value="in_progress">운송중</option>
                              <option value="completed">완료</option>
                              <option value="cancelled">취소됨</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      
                      <div class="detail-card">
                        <h4>상태 정보</h4>
                        <div class="detail-list">
                          <div class="detail-item">
                            <span class="label">현재 상태</span>
                            <span :class="['status-badge', `status-${order.status}`]">
                              {{ getKoreanStatusText(order.status) }}
                            </span>
                          </div>
                          <div class="detail-item">
                            <span class="label">생성일</span>
                            <span class="value">{{ formatDate(order.createdAt) }}</span>
                          </div>
                          <div class="detail-item">
                            <span class="label">마지막 업데이트</span>
                            <span class="value">{{ formatDate(order.updatedAt) }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      
      <!-- Empty State -->
      <div v-if="filteredOrders.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14,2 14,8 20,8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10,9 9,9 8,9"></polyline>
          </svg>
        </div>
        <h3>주문이 없습니다</h3>
        <p>새로운 주문을 등록하거나 필터를 조정해보세요.</p>
        <button @click="openCreateModal" class="create-btn">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          새 주문 등록
        </button>
      </div>
    </div>

    <!-- Create Order Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @click="closeModals">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>새 주문 등록</h2>
          <button @click="closeModals" class="close-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="createOrder" class="modal-form">
          <div class="form-group">
            <label>고객명</label>
            <input v-model="newOrder.customerName" type="text" required class="form-input" />
          </div>
          
          <div class="form-group">
            <label>고객 전화번호</label>
            <input v-model="newOrder.customerPhone" type="tel" required class="form-input" />
          </div>
          
          <div class="form-group">
            <label>픽업 위치</label>
            <input v-model="newOrder.pickupLocation" type="text" required class="form-input" />
          </div>
          
          <div class="form-group">
            <label>하역 위치</label>
            <input v-model="newOrder.dropoffLocation" type="text" required class="form-input" />
          </div>
          
          <div class="form-group">
            <label>우선순위</label>
            <select v-model="newOrder.priority" class="form-select">
              <option value="low">낮음</option>
              <option value="normal">보통</option>
              <option value="high">높음</option>
              <option value="urgent">긴급</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>예상 요금 (원)</label>
            <input v-model="newOrder.estimatedFare" type="number" class="form-input" />
          </div>
          
          <div class="form-group">
            <label>설명</label>
            <textarea v-model="newOrder.description" class="form-textarea" rows="3"></textarea>
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="closeModals" class="btn-secondary">취소</button>
            <button type="submit" class="btn-primary" :disabled="loading">
              {{ loading ? '등록 중...' : '등록' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Order Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeModals">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>주문 수정</h2>
          <button @click="closeModals" class="close-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="updateOrder" class="modal-form">
          <div class="form-group">
            <label>고객명</label>
            <input v-model="selectedOrder.customerName" type="text" required class="form-input" />
          </div>
          
          <div class="form-group">
            <label>고객 전화번호</label>
            <input v-model="selectedOrder.customerPhone" type="tel" required class="form-input" />
          </div>
          
          <div class="form-group">
            <label>픽업 위치</label>
            <input v-model="selectedOrder.pickupLocation" type="text" required class="form-input" />
          </div>
          
          <div class="form-group">
            <label>하역 위치</label>
            <input v-model="selectedOrder.dropoffLocation" type="text" required class="form-input" />
          </div>
          
          <div class="form-group">
            <label>상태</label>
            <select v-model="selectedOrder.status" class="form-select">
              <option value="pending">대기중</option>
              <option value="assigned">배정됨</option>
              <option value="in_progress">운송중</option>
              <option value="completed">완료</option>
              <option value="cancelled">취소됨</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>우선순위</label>
            <select v-model="selectedOrder.priority" class="form-select">
              <option value="low">낮음</option>
              <option value="normal">보통</option>
              <option value="high">높음</option>
              <option value="urgent">긴급</option>
            </select>
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="closeModals" class="btn-secondary">취소</button>
            <button type="submit" class="btn-primary" :disabled="loading">
              {{ loading ? '수정 중...' : '수정' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import api from '../api'
import { CreateOrderRequest } from '@/types'

const showCreateModal = ref(false)
const showEditModal = ref(false)
const selectedOrder = ref<any>(null)
const loading = ref(false)
interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  pickupLocation: string;
  dropoffLocation: string;
  priority: string;
  estimatedFare: number;
  description?: string;
  status: string;
  productName?: string; // Added productName property
  shipper?: string; // Added shipper property
  driver?: {
    name: string;
    vehicle: string;
  };
  scheduledPickupTime?: string;
  createdAt: string;
  updatedAt: string;
}

const orders = ref<Order[]>([])
const expandedOrders = ref<number[]>([])
const selectedOrders = ref<number[]>([])

const newOrder = reactive({
  customerName: '',
  customerPhone: '',
  pickupLocation: '',
  dropoffLocation: '',
  priority: 'normal',
  estimatedFare: 0,
  description: ''
})

const filters = reactive({
  client: '',
  receiptNumber: '',
  startDate: '',
  endDate: '',
  dispatchStatus: '',
  shipper: '',
  productName: '',
  loadingLocation: '',
  unloadingLocation: ''
})

const stats = ref({
  totalOrders: 0,
  pendingOrders: 0,
  inTransitOrders: 0,
  completedOrders: 0,
  emergencyOrders: 0
})

const statsData = computed(() => [
  {
    key: 'total',
    label: '전체 주문',
    value: stats.value.totalOrders,
    iconClass: 'total',
    iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    key: 'pending',
    label: '대기 중',
    value: stats.value.pendingOrders,
    iconClass: 'pending',
    iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    key: 'inTransit',
    label: '운송 중',
    value: stats.value.inTransitOrders,
    iconClass: 'inTransit',
    iconPath: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4'
  },
  {
    key: 'completed',
    label: '완료',
    value: stats.value.completedOrders,
    iconClass: 'completed',
    iconPath: 'M5 13l4 4L19 7'
  },
  {
    key: 'emergency',
    label: '비상상황',
    value: stats.value.emergencyOrders,
    iconClass: 'emergency',
    iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
  }
])

const filteredOrders = computed(() => {
  let filtered = orders.value
  
  if (filters.client) {
    filtered = filtered.filter((order: any) => 
      order.customerName?.toLowerCase().includes(filters.client.toLowerCase())
    )
  }
  
  if (filters.dispatchStatus) {
    filtered = filtered.filter((order: any) => 
      getKoreanStatusText(order.status) === filters.dispatchStatus
    )
  }
  
  if (filters.shipper) {
    filtered = filtered.filter((order: any) => 
      order.driver?.name?.toLowerCase().includes(filters.shipper.toLowerCase())
    )
  }
  
  if (filters.productName) {
    filtered = filtered.filter((order: any) => 
      order.description?.toLowerCase().includes(filters.productName.toLowerCase())
    )
  }
  
  if (filters.loadingLocation) {
    filtered = filtered.filter((order: any) => 
      order.pickupLocation?.toLowerCase().includes(filters.loadingLocation.toLowerCase())
    )
  }
  
  if (filters.unloadingLocation) {
    filtered = filtered.filter((order: any) => 
      order.dropoffLocation?.toLowerCase().includes(filters.unloadingLocation.toLowerCase())
    )
  }
  
  return filtered
})

onMounted(async () => {
  await loadOrders()
})

const loadOrders = async () => {
  try {
    loading.value = true
    const data = await api.getOrders()
    orders.value = data.map(order => ({
      ...order,
      estimatedFare: order.estimatedFare ?? 0 // Provide default value if undefined
    }))
    // Calculate stats after orders are loaded
    await loadStats()
  } catch (error) {
    console.error('Failed to load orders:', error)
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  try {
    // Calculate stats from actual orders data
    const totalOrders = orders.value.length
    const pendingOrders = orders.value.filter(order => order.status === 'pending').length
    const inTransitOrders = orders.value.filter(order => order.status === 'in_progress' || order.status === 'assigned').length
    const completedOrders = orders.value.filter(order => order.status === 'completed').length
    const emergencyOrders = orders.value.filter(order => order.priority === 'urgent').length
    
    stats.value = {
      totalOrders,
      pendingOrders,
      inTransitOrders,
      completedOrders,
      emergencyOrders
    }
  } catch (error) {
    console.error('Failed to load stats:', error)
  }
}

const toggleOrderExpansion = (orderId: number) => {
  const index = expandedOrders.value.indexOf(orderId)
  if (index > -1) {
    expandedOrders.value.splice(index, 1)
  } else {
    expandedOrders.value.push(orderId)
  }
}

const toggleOrderSelection = (orderId: number) => {
  const index = selectedOrders.value.indexOf(orderId)
  if (index > -1) {
    selectedOrders.value.splice(index, 1)
  } else {
    selectedOrders.value.push(orderId)
  }
}

const selectAllOrders = () => {
  if (selectedOrders.value.length === filteredOrders.value.length) {
    selectedOrders.value = []
  } else {
    selectedOrders.value = filteredOrders.value.map((order: any) => order.id)
  }
}

const clearFilters = () => {
  Object.assign(filters, {
    client: '',
    receiptNumber: '',
    startDate: '',
    endDate: '',
    dispatchStatus: '',
    shipper: '',
    productName: '',
    loadingLocation: '',
    unloadingLocation: ''
  })
}

const openCreateModal = () => {
  showCreateModal.value = true
}

const openEditModal = (order: any) => {
  selectedOrder.value = order
  showEditModal.value = true
}

const viewOrderDetails = (order: any) => {
  console.log('View order details:', order)
}

const closeModals = () => {
  showCreateModal.value = false
  showEditModal.value = false
  selectedOrder.value = null
  // Reset new order form
  Object.assign(newOrder, {
    customerName: '',
    customerPhone: '',
    pickupLocation: '',
    dropoffLocation: '',
    priority: 'normal',
    estimatedFare: 0,
    description: ''
  })
}

const createOrder = async () => {
  try {
    loading.value = true
    await api.createOrder(newOrder)
    await loadOrders()
    await loadStats()
    closeModals()
    console.log('✅ Order created successfully')
  } catch (error) {
    console.error('❌ Failed to create order:', error)
  } finally {
    loading.value = false
  }
}

const updateOrder = async () => {
  try {
    loading.value = true
    await api.updateOrder(selectedOrder.value.id, selectedOrder.value)
    await loadOrders() // Reload orders to get updated data
    await loadStats() // Reload stats
    closeModals()
    console.log('✅ Order updated successfully')
  } catch (error) {
    console.error('❌ Failed to update order:', error)
    // Revert changes on error
    await loadOrders()
  } finally {
    loading.value = false
  }
}

const updateOrderStatus = async (order: any) => {
  try {
    await api.updateOrder(order.id, { status: order.status } as Partial<CreateOrderRequest>)
    console.log('✅ Order status updated successfully')
  } catch (error) {
    console.error('❌ Failed to update order status:', error)
    // Revert the status change on error
    await loadOrders()
  }
}

const getKoreanStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'pending': '대기중',
    'assigned': '배정됨',
    'in_progress': '운송중',
    'completed': '완료',
    'cancelled': '취소됨',
    'emergency': '비상상황'
  }
  return statusMap[status] || status
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ko-KR')
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  }).format(amount)
}
</script>

<style scoped>
.orders-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

/* Modern Header */
.page-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title h1 {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 0.5rem 0;
}

.subtitle {
  color: #6b7280;
  font-size: 1.1rem;
  margin: 0;
}

.create-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px rgba(102, 126, 234, 0.4);
}

.create-btn .icon {
  width: 20px;
  height: 20px;
}

/* Modern Stats */
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-icon.total { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.stat-icon.pending { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.stat-icon.inTransit { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.stat-icon.completed { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.stat-icon.emergency { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }

.stat-icon svg {
  width: 30px;
  height: 30px;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.stat-label {
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 500;
}

/* Modern Filters */
.filters-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.filters-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.filter-btn {
  background: #f3f4f6;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  color: #6b7280;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.filter-btn svg {
  width: 16px;
  height: 16px;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
}

.modern-select,
.modern-input {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  background: white;
}

.modern-select:focus,
.modern-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Modern Table */
.table-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.table-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.table-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  color: #374151;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #667eea;
}

.selected-count {
  color: #6b7280;
  font-size: 0.9rem;
}

.table-wrapper {
  overflow-x: auto;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
}

.modern-table th {
  background: #f9fafb;
  padding: 1rem 1.5rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.modern-table td {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.table-row {
  transition: all 0.3s ease;
  cursor: pointer;
}

.table-row:hover {
  background: #f9fafb;
}

.table-row.expanded {
  background: #f0f9ff;
}

.checkbox-col {
  width: 50px;
}

.actions-col {
  width: 120px;
}

.customer-cell {
  min-width: 200px;
}

.customer-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.customer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.1rem;
}

.customer-details {
  flex: 1;
}

.customer-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.customer-phone {
  color: #6b7280;
  font-size: 0.9rem;
}

.shipper-cell,
.product-cell {
  min-width: 150px;
}

.shipper-name,
.product-name {
  font-weight: 500;
  color: #374151;
}

.location-cell {
  min-width: 200px;
}

.location-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.location-icon {
  width: 16px;
  height: 16px;
  color: #6b7280;
  flex-shrink: 0;
}

.location-text {
  color: #374151;
  font-size: 0.9rem;
}

.status-cell {
  min-width: 120px;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-pending {
  background: #fef3c7;
  color: #92400e;
}

.status-assigned {
  background: #dbeafe;
  color: #1e40af;
}

.status-in_progress {
  background: #e0e7ff;
  color: #3730a3;
}

.status-completed {
  background: #d1fae5;
  color: #065f46;
}

.status-cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.status-emergency {
  background: #fecaca;
  color: #7f1d1d;
}

.actions-cell {
  min-width: 120px;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

.expand-btn {
  background: #f3f4f6;
  color: #6b7280;
}

.expand-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.edit-btn {
  background: #dbeafe;
  color: #1e40af;
}

.edit-btn:hover {
  background: #bfdbfe;
  color: #1e3a8a;
}

.view-btn {
  background: #d1fae5;
  color: #065f46;
}

.view-btn:hover {
  background: #a7f3d0;
  color: #047857;
}

/* Expanded Details */
.expanded-details {
  background: #f0f9ff;
}

.order-details-panel {
  padding: 2rem;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.detail-card {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
}

.detail-card h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.detail-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-item .label {
  font-weight: 500;
  color: #6b7280;
  font-size: 0.9rem;
}

.detail-item .value {
  font-weight: 600;
  color: #1f2937;
}

.priority-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.priority-low {
  background: #f3f4f6;
  color: #6b7280;
}

.priority-normal {
  background: #dbeafe;
  color: #1e40af;
}

.priority-high {
  background: #fef3c7;
  color: #92400e;
}

.priority-urgent {
  background: #fee2e2;
  color: #991b1b;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.empty-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 2rem;
  color: #d1d5db;
}

.empty-icon svg {
  width: 100%;
  height: 100%;
}

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.empty-state p {
  margin-bottom: 2rem;
  font-size: 1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .orders-page {
    padding: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
  }
  
  .table-wrapper {
    overflow-x: scroll;
  }
  
  .modern-table {
    min-width: 800px;
  }
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #f3f4f6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #e5e7eb;
}

.close-btn svg {
  width: 16px;
  height: 16px;
  color: #6b7280;
}

.modal-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background: white;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.status-select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.status-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.status-select:hover {
  border-color: #9ca3af;
}
</style>