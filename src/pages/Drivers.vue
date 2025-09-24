<template>
  <div class="drivers-page">
    <!-- Modern Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-title">
          <h1>배차 관리</h1>
          <p class="subtitle">Dispatch Management System</p>
        </div>
        <button @click="openCreateModal" class="create-btn">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          새 운전자 등록
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
        <h3>배차 목록</h3>
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
          <label>운전자명</label>
          <input 
            v-model="filters.driverName" 
            type="text" 
            placeholder="운전자명 검색" 
            class="modern-input"
          />
        </div>
        
        <div class="filter-group">
          <label>상태</label>
          <select v-model="filters.status" class="modern-select">
            <option value="">전체 상태</option>
            <option value="available">대기중</option>
            <option value="busy">운송중</option>
            <option value="offline">오프라인</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>차량번호</label>
          <input 
            v-model="filters.vehicleNumber" 
            type="text" 
            placeholder="차량번호 검색" 
            class="modern-input"
          />
        </div>
        
        <div class="filter-group">
          <label>지역</label>
          <select v-model="filters.region" class="modern-select">
            <option value="">전체 지역</option>
            <option value="서울">서울</option>
            <option value="경기">경기</option>
            <option value="인천">인천</option>
            <option value="부산">부산</option>
          </select>
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
              :checked="selectedDrivers.length === filteredDrivers.length && filteredDrivers.length > 0"
              @change="selectAllDrivers"
            />
            <span class="checkmark"></span>
            전체 선택
          </label>
          <span class="selected-count" v-if="selectedDrivers.length > 0">
            {{ selectedDrivers.length }}개 선택됨
          </span>
        </div>
      </div>
      
      <div class="table-wrapper">
        <table class="modern-table">
          <thead>
            <tr>
              <th class="checkbox-col"></th>
              <th>운전자 정보</th>
              <th>차량 정보</th>
              <th>연락처</th>
              <th>상태</th>
              <th>현재 위치</th>
              <th>배정된 주문</th>
              <th class="actions-col">관리</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="driver in filteredDrivers" :key="driver.id">
              <tr class="table-row" :class="{ expanded: expandedDrivers.includes(driver.id) }">
                <td class="checkbox-col">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      :checked="selectedDrivers.includes(driver.id)"
                      @change="toggleDriverSelection(driver.id)"
                    />
                    <span class="checkmark"></span>
                  </label>
                </td>
                
                <td class="driver-cell">
                  <div class="driver-info">
                    <div class="driver-avatar">
                      {{ driver.name.charAt(0) }}
                    </div>
                    <div class="driver-details">
                      <div class="driver-name">{{ driver.name }}</div>
                      <div class="driver-id">ID: {{ driver.id }}</div>
                    </div>
                  </div>
                </td>
                
                <td class="vehicle-cell">
                  <div class="vehicle-info">
                    <div class="vehicle-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 11l-1.5-1.5c-.8-.8-2-1.2-3.2-1.2H9.7c-1.2 0-2.4.4-3.2 1.2L5 11l-.5.1C3.7 11.3 3 12.1 3 13v3c0 .6.4 1 1 1h2"></path>
                        <circle cx="7" cy="17" r="2"></circle>
                        <circle cx="17" cy="17" r="2"></circle>
                      </svg>
                    </div>
                    <div class="vehicle-details">
                      <div class="vehicle-name">{{ driver.vehicle }}</div>
                      <div class="vehicle-license" v-if="driver.licenseNumber">
                        {{ driver.licenseNumber }}
                      </div>
                    </div>
                  </div>
                </td>
                
                <td class="contact-cell">
                  <div class="contact-info">
                    <div class="contact-item">
                      <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      <span class="contact-text">{{ driver.phone }}</span>
                    </div>
                    <div class="contact-item" v-if="driver.email">
                      <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                      <span class="contact-text">{{ driver.email }}</span>
                    </div>
                  </div>
                </td>
                
                <td class="status-cell">
                  <span :class="['status-badge', `status-${driver.status}`]">
                    {{ getKoreanStatusText(driver.status) }}
                  </span>
                </td>
                
                <td class="location-cell">
                  <div class="location-info">
                    <svg class="location-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span class="location-text">{{ driver.currentLocation || '위치 정보 없음' }}</span>
                  </div>
                </td>
                
                <td class="orders-cell">
                  <div class="orders-info">
                    <span class="orders-count">{{ driver.orders ? driver.orders.length : 0 }}건</span>
                    <span class="orders-status" v-if="driver.orders && driver.orders.length > 0">
                      {{ getActiveOrdersCount(driver.orders) }}건 진행중
                    </span>
                  </div>
                </td>
                
                <td class="actions-cell">
                  <div class="action-buttons">
                    <button @click="toggleDriverExpansion(driver.id)" class="action-btn expand-btn">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="6,9 12,15 18,9"></polyline>
                      </svg>
                    </button>
                    <button @click="openEditModal(driver)" class="action-btn edit-btn">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="m18.5 2.5 a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button @click="viewDriverDetails(driver)" class="action-btn view-btn">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              
              <!-- Expanded Details -->
              <tr v-if="expandedDrivers.includes(driver.id)" class="expanded-details">
                <td colspan="8">
                  <div class="driver-details-panel">
                    <div class="details-grid">
                      <div class="detail-card">
                        <h4>운전자 정보</h4>
                        <div class="detail-list">
                          <div class="detail-item">
                            <span class="label">운전자 ID</span>
                            <span class="value">#{{ driver.id }}</span>
                          </div>
                          <div class="detail-item">
                            <span class="label">이름</span>
                            <span class="value">{{ driver.name }}</span>
                          </div>
                          <div class="detail-item">
                            <span class="label">연락처</span>
                            <span class="value">{{ driver.phone }}</span>
                          </div>
                          <div class="detail-item">
                            <span class="label">이메일</span>
                            <span class="value">{{ driver.email || '정보 없음' }}</span>
                          </div>
                          <div class="detail-item">
                            <span class="label">주소</span>
                            <span class="value">{{ driver.address || '정보 없음' }}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div class="detail-card">
                        <h4>차량 정보</h4>
                        <div class="detail-list">
                          <div class="detail-item">
                            <span class="label">차량명</span>
                            <span class="value">{{ driver.vehicle }}</span>
                          </div>
                          <div class="detail-item">
                            <span class="label">면허번호</span>
                            <span class="value">{{ driver.licenseNumber || '정보 없음' }}</span>
                          </div>
                          <div class="detail-item">
                            <span class="label">차량 상태</span>
                            <span :class="['status-badge', `status-${driver.status}`]">
                              {{ getKoreanStatusText(driver.status) }}
                            </span>
                          </div>
                          <div class="detail-item">
                            <span class="label">활성 상태</span>
                            <span :class="['status-badge', driver.isActive ? 'status-active' : 'status-inactive']">
                              {{ driver.isActive ? '활성' : '비활성' }}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div class="detail-card">
                        <h4>배정된 주문</h4>
                        <div class="orders-list" v-if="driver.orders && driver.orders.length > 0">
                          <div 
                            v-for="order in driver.orders" 
                            :key="order.id" 
                            class="order-item"
                          >
                            <div class="order-info">
                              <div class="order-id">#{{ order.id }}</div>
                              <div class="order-customer">{{ order.customerName }}</div>
                              <div class="order-route">
                                {{ order.pickupLocation }} → {{ order.dropoffLocation }}
                              </div>
                            </div>
                            <div class="order-status">
                              <span :class="['status-badge', `status-${order.status}`]">
                                {{ getKoreanStatusText(order.status) }}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div v-else class="no-orders">
                          배정된 주문이 없습니다
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
      <div v-if="filteredDrivers.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 11l-1.5-1.5c-.8-.8-2-1.2-3.2-1.2H9.7c-1.2 0-2.4.4-3.2 1.2L5 11l-.5.1C3.7 11.3 3 12.1 3 13v3c0 .6.4 1 1 1h2"></path>
            <circle cx="7" cy="17" r="2"></circle>
            <circle cx="17" cy="17" r="2"></circle>
          </svg>
        </div>
        <h3>운전자가 없습니다</h3>
        <p>새로운 운전자를 등록하거나 필터를 조정해보세요.</p>
        <button @click="openCreateModal" class="create-btn">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          새 운전자 등록
        </button>
      </div>
    </div>

    <!-- Create Driver Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @click="closeModals">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>새 운전자 등록</h2>
          <button @click="closeModals" class="close-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="createDriver" class="modal-form">
          <div class="form-group">
            <label>운전자 이름</label>
            <input v-model="newDriver.name" type="text" required class="form-input" />
          </div>
          
          <div class="form-group">
            <label>전화번호</label>
            <input v-model="newDriver.phone" type="tel" required class="form-input" />
          </div>
          
          <div class="form-group">
            <label>차량 정보</label>
            <input v-model="newDriver.vehicle" type="text" required class="form-input" />
          </div>
          
          <div class="form-group">
            <label>이메일</label>
            <input v-model="newDriver.email" type="email" class="form-input" />
          </div>
          
          <div class="form-group">
            <label>주소</label>
            <input v-model="newDriver.address" type="text" class="form-input" />
          </div>
          
          <div class="form-group">
            <label>면허번호</label>
            <input v-model="newDriver.licenseNumber" type="text" class="form-input" />
          </div>
          
          <div class="form-group">
            <label>상태</label>
            <select v-model="newDriver.status" class="form-select">
              <option value="available">대기중</option>
              <option value="busy">운송중</option>
              <option value="offline">오프라인</option>
            </select>
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

    <!-- Edit Driver Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeModals">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>운전자 수정</h2>
          <button @click="closeModals" class="close-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="updateDriver" class="modal-form">
          <div class="form-group">
            <label>운전자 이름</label>
            <input v-model="selectedDriver.name" type="text" required class="form-input" />
          </div>
          
          <div class="form-group">
            <label>전화번호</label>
            <input v-model="selectedDriver.phone" type="tel" required class="form-input" />
          </div>
          
          <div class="form-group">
            <label>차량 정보</label>
            <input v-model="selectedDriver.vehicle" type="text" required class="form-input" />
          </div>
          
          <div class="form-group">
            <label>이메일</label>
            <input v-model="selectedDriver.email" type="email" class="form-input" />
          </div>
          
          <div class="form-group">
            <label>주소</label>
            <input v-model="selectedDriver.address" type="text" class="form-input" />
          </div>
          
          <div class="form-group">
            <label>면허번호</label>
            <input v-model="selectedDriver.licenseNumber" type="text" class="form-input" />
          </div>
          
          <div class="form-group">
            <label>상태</label>
            <select v-model="selectedDriver.status" class="form-select">
              <option value="available">대기중</option>
              <option value="busy">운송중</option>
              <option value="offline">오프라인</option>
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

const showCreateModal = ref(false)
const showEditModal = ref(false)
const selectedDriver = ref<any>(null)
const loading = ref(false)
const drivers = ref([])
const expandedDrivers = ref<number[]>([])
const selectedDrivers = ref<number[]>([])

const filters = reactive({
  driverName: '',
  status: '',
  vehicleNumber: '',
  region: ''
})

const stats = ref({
  totalDrivers: 0,
  availableDrivers: 0,
  busyDrivers: 0,
  offlineDrivers: 0,
  activeDrivers: 0
})

const statsData = computed(() => [
  {
    key: 'total',
    label: '전체 운전자',
    value: stats.value.totalDrivers,
    iconClass: 'total',
    iconPath: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2'
  },
  {
    key: 'available',
    label: '대기 중',
    value: stats.value.availableDrivers,
    iconClass: 'available',
    iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    key: 'busy',
    label: '운송 중',
    value: stats.value.busyDrivers,
    iconClass: 'busy',
    iconPath: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4'
  },
  {
    key: 'offline',
    label: '오프라인',
    value: stats.value.offlineDrivers,
    iconClass: 'offline',
    iconPath: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728'
  },
  {
    key: 'active',
    label: '활성 운전자',
    value: stats.value.activeDrivers,
    iconClass: 'active',
    iconPath: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z'
  }
])

const filteredDrivers = computed(() => {
  let filtered = drivers.value
  
  if (filters.driverName) {
    filtered = filtered.filter((driver: any) => 
      driver.name.toLowerCase().includes(filters.driverName.toLowerCase())
    )
  }
  
  if (filters.status) {
    filtered = filtered.filter((driver: any) => 
      driver.status === filters.status
    )
  }
  
  if (filters.vehicleNumber) {
    filtered = filtered.filter((driver: any) => 
      driver.vehicle.toLowerCase().includes(filters.vehicleNumber.toLowerCase())
    )
  }
  
  return filtered
})

onMounted(async () => {
  await loadDrivers()
})

const loadDrivers = async () => {
  try {
    loading.value = true
    const data = await api.getDrivers()
    drivers.value = data
    // Calculate stats after drivers are loaded
    await loadStats()
  } catch (error) {
    console.error('Failed to load drivers:', error)
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  try {
    // Calculate stats from actual drivers data
    const totalDrivers = drivers.value.length
    const availableDrivers = drivers.value.filter(driver => driver.status === 'available').length
    const busyDrivers = drivers.value.filter(driver => driver.status === 'busy').length
    const offlineDrivers = drivers.value.filter(driver => driver.status === 'offline').length
    const activeDrivers = drivers.value.filter(driver => driver.isActive).length
    
    stats.value = {
      totalDrivers,
      availableDrivers,
      busyDrivers,
      offlineDrivers,
      activeDrivers
    }
  } catch (error) {
    console.error('Failed to load stats:', error)
  }
}

const toggleDriverExpansion = (driverId: number) => {
  const index = expandedDrivers.value.indexOf(driverId)
  if (index > -1) {
    expandedDrivers.value.splice(index, 1)
  } else {
    expandedDrivers.value.push(driverId)
  }
}

const toggleDriverSelection = (driverId: number) => {
  const index = selectedDrivers.value.indexOf(driverId)
  if (index > -1) {
    selectedDrivers.value.splice(index, 1)
  } else {
    selectedDrivers.value.push(driverId)
  }
}

const selectAllDrivers = () => {
  if (selectedDrivers.value.length === filteredDrivers.value.length) {
    selectedDrivers.value = []
  } else {
    selectedDrivers.value = filteredDrivers.value.map((driver: any) => driver.id)
  }
}

const clearFilters = () => {
  Object.assign(filters, {
    driverName: '',
    status: '',
    vehicleNumber: '',
    region: ''
  })
}

const openCreateModal = () => {
  showCreateModal.value = true
}

const openEditModal = (driver: any) => {
  selectedDriver.value = driver
  showEditModal.value = true
}

const viewDriverDetails = (driver: any) => {
  console.log('View driver details:', driver)
}

const closeModals = () => {
  showCreateModal.value = false
  showEditModal.value = false
  selectedDriver.value = null
}

const newDriver = reactive({
  name: '',
  phone: '',
  vehicle: '',
  email: '',
  address: '',
  licenseNumber: '',
  status: 'available'
})

const createDriver = async () => {
  try {
    loading.value = true
    await api.createDriver(newDriver)
    await loadDrivers()
    closeModals()
    // Reset form
    Object.assign(newDriver, {
      name: '',
      phone: '',
      vehicle: '',
      email: '',
      address: '',
      licenseNumber: '',
      status: 'available'
    })
    console.log('✅ Driver created successfully')
  } catch (error) {
    console.error('❌ Failed to create driver:', error)
  } finally {
    loading.value = false
  }
}

const updateDriver = async () => {
  try {
    loading.value = true
    await api.updateDriver(selectedDriver.value.id, selectedDriver.value)
    await loadDrivers()
    closeModals()
    console.log('✅ Driver updated successfully')
  } catch (error) {
    console.error('❌ Failed to update driver:', error)
  } finally {
    loading.value = false
  }
}

const getKoreanStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'available': '대기중',
    'busy': '운송중',
    'offline': '오프라인',
    'active': '활성',
    'inactive': '비활성'
  }
  return statusMap[status] || status
}

const getActiveOrdersCount = (orders: any[]) => {
  return orders.filter(order => 
    order.status === 'assigned' || order.status === 'in_progress'
  ).length
}
</script>

<style scoped>
.drivers-page {
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
.stat-icon.available { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.stat-icon.busy { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.stat-icon.offline { background: linear-gradient(135deg, #6c757d 0%, #495057 100%); }
.stat-icon.active { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }

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

.driver-cell {
  min-width: 200px;
}

.driver-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.driver-avatar {
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

.driver-details {
  flex: 1;
}

.driver-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.driver-id {
  color: #6b7280;
  font-size: 0.9rem;
}

.vehicle-cell {
  min-width: 200px;
}

.vehicle-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.vehicle-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.vehicle-icon svg {
  width: 20px;
  height: 20px;
}

.vehicle-details {
  flex: 1;
}

.vehicle-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.vehicle-license {
  color: #6b7280;
  font-size: 0.9rem;
}

.contact-cell {
  min-width: 150px;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.contact-icon {
  width: 16px;
  height: 16px;
  color: #6b7280;
  flex-shrink: 0;
}

.contact-text {
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

.status-available {
  background: #d1fae5;
  color: #065f46;
}

.status-busy {
  background: #dbeafe;
  color: #1e40af;
}

.status-offline {
  background: #f3f4f6;
  color: #6b7280;
}

.status-active {
  background: #d1fae5;
  color: #065f46;
}

.status-inactive {
  background: #fee2e2;
  color: #991b1b;
}

.location-cell {
  min-width: 150px;
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

.orders-cell {
  min-width: 120px;
}

.orders-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.orders-count {
  font-weight: 600;
  color: #1f2937;
}

.orders-status {
  color: #6b7280;
  font-size: 0.8rem;
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

.driver-details-panel {
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

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
}

.order-info {
  flex: 1;
}

.order-id {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.order-customer {
  color: #374151;
  margin-bottom: 0.25rem;
}

.order-route {
  color: #6b7280;
  font-size: 0.9rem;
}

.order-status {
  flex-shrink: 0;
}

.no-orders {
  text-align: center;
  color: #6b7280;
  font-style: italic;
  padding: 2rem;
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
  .drivers-page {
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
    min-width: 1000px;
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
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background: white;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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
</style>