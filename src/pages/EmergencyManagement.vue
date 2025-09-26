<template>
  <div class="emergency-management">
    <div class="page-header">
      <h1>🚨 비상 상황 관리</h1>
      <p>Emergency Management System</p>
    </div>

    <!-- Statistics Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon active">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ stats.activeEmergencies }}</h3>
          <p>활성 비상상황</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon resolved">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ stats.resolvedToday }}</h3>
          <p>오늘 해결됨</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon time">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ stats.avgResponseTime }}분</h3>
          <p>평균 대응시간</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon vehicles">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 11l-1.5-1.5c-.8-.8-2-1.2-3.2-1.2H9.7c-1.2 0-2.4.4-3.2 1.2L5 11l-.5.1C3.7 11.3 3 12.1 3 13v3c0 .6.4 1 1 1h2"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ stats.vehiclesInEmergency }}</h3>
          <p>비상상황 차량</p>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="action-buttons">
      <button @click="openModal" class="btn btn-primary">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
        새 비상상황 신고
      </button>
      <button @click="loadEmergencies" class="btn btn-secondary">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
        </svg>
        새로고침
      </button>
    </div>

    <!-- Emergency List -->
    <div class="emergency-list">
      <div class="list-header">
        <h2>비상상황 목록</h2>
        <div class="filter-controls">
          <select v-model="statusFilter" @change="loadEmergencies">
            <option value="">모든 상태</option>
            <option value="reported">신고됨</option>
            <option value="investigating">조사 중</option>
            <option value="responding">대응 중</option>
            <option value="resolved">해결됨</option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>비상상황을 불러오는 중...</p>
                </div>

      <div v-else-if="emergencies.length === 0" class="empty-state">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        <h3>비상상황이 없습니다</h3>
        <p>새로운 비상상황을 신고하거나 다른 상태를 확인해보세요.</p>
      </div>

      <div v-else class="emergency-cards">
        <div 
          v-for="emergency in emergencies" 
          :key="emergency.id"
          class="emergency-card"
          :class="`priority-${emergency.priority}`"
        >
          <div class="card-header">
            <div class="emergency-type">
              <span class="type-badge">{{ getEmergencyTypeText(emergency.type) }}</span>
              <span class="priority-badge" :class="`priority-${emergency.priority}`">
                {{ getPriorityText(emergency.priority) }}
                </span>
                </div>
            <div class="emergency-status" :class="`status-${emergency.status}`">
              {{ getResponseStatusText(emergency.status) }}
                </div>
                </div>

          <div class="card-content">
            <div class="emergency-info">
              <div class="info-row">
                <span class="label">차량번호:</span>
                <span class="value">{{ emergency.vehiclePlate || 'N/A' }}</span>
              </div>
              <div class="info-row">
                <span class="label">운전자:</span>
                <span class="value">{{ emergency.driverName || 'N/A' }}</span>
              </div>
              <div class="info-row">
                <span class="label">위치:</span>
                <span class="value">{{ emergency.location || 'N/A' }}</span>
              </div>
              <div class="info-row">
                <span class="label">신고시간:</span>
                <span class="value">{{ formatDate(emergency.reportedAt) }}</span>
              </div>
            </div>

            <div class="emergency-description">
              <p>{{ emergency.description }}</p>
            </div>

            <div v-if="emergency.responseTime" class="response-info">
              <div class="response-time">
                <span class="label">대응시간:</span>
                <span class="value">{{ emergency.responseTime }}분</span>
              </div>
            </div>
          </div>

          <div class="card-actions">
                  <button @click="viewEmergencyDetails(emergency)" class="btn btn-sm btn-outline">
              상세보기
                  </button>
                  <button @click="updateEmergencyStatus(emergency)" class="btn btn-sm btn-primary">
              상태변경
                  </button>
                </div>
        </div>
      </div>
    </div>

    <!-- Create Emergency Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>새 비상상황 신고</h3>
          <button @click="closeModal" class="close-btn">&times;</button>
        </div>
        
        <form @submit.prevent="handleSubmit" class="emergency-form">
            <div class="form-group">
            <label for="type">비상상황 유형 *</label>
            <select id="type" v-model="emergencyForm.type" required>
                <option value="">선택하세요</option>
              <option value="accident">교통사고</option>
              <option value="breakdown">차량고장</option>
                <option value="theft">도난</option>
                <option value="weather">기상악화</option>
                <option value="traffic">교통체증</option>
                <option value="other">기타</option>
              </select>
            </div>

            <div class="form-group">
            <label for="priority">우선순위</label>
            <select id="priority" v-model="emergencyForm.priority">
                <option value="low">낮음</option>
                <option value="medium">보통</option>
                <option value="high">높음</option>
                <option value="critical">긴급</option>
              </select>
            </div>

          <div class="form-group">
            <label for="vehiclePlate">차량번호</label>
            <input 
              id="vehiclePlate" 
              type="text" 
              v-model="emergencyForm.vehiclePlate"
              placeholder="예: 서울 12가 3456"
            >
          </div>
          
          <div class="form-group">
            <label for="driverName">운전자명</label>
            <input 
              id="driverName" 
              type="text" 
              v-model="emergencyForm.driverName"
              placeholder="운전자 이름"
            >
          </div>
          
          <div class="form-group">
            <label for="location">현재 위치</label>
            <input 
              id="location" 
              type="text" 
              v-model="emergencyForm.location"
              placeholder="예: 서울특별시 강남구 테헤란로 123"
            >
          </div>
          
          <div class="form-group">
            <label for="contactPhone">연락처</label>
            <input 
              id="contactPhone" 
              type="tel" 
              v-model="emergencyForm.contactPhone"
              placeholder="예: 010-1234-5678"
            >
          </div>
          
          <div class="form-group">
            <label for="description">상세 설명 *</label>
            <textarea 
              id="description" 
              v-model="emergencyForm.description"
              placeholder="비상상황에 대한 상세한 설명을 입력하세요"
              rows="4"
              required
            ></textarea>
          </div>

          <div class="form-group">
            <label for="vehicleImage">차량 이미지</label>
            <input 
              id="vehicleImage" 
              type="file" 
              accept="image/*"
              @change="handleImageUpload"
              class="form-input"
            />
            <div v-if="emergencyForm.vehicleImage" class="image-preview">
              <img :src="getImagePreview(emergencyForm.vehicleImage)" alt="차량 이미지 미리보기" />
              <button type="button" @click="removeImage" class="remove-image-btn">×</button>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn btn-secondary">
              취소
            </button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading">신고 중...</span>
              <span v-else>비상상황 신고</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Status Update Modal -->
    <div v-if="showStatusModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>비상상황 상태 변경</h3>
          <button @click="closeModal" class="close-btn">&times;</button>
        </div>

        <form @submit.prevent="handleStatusUpdate" class="emergency-form">
          <div class="form-group">
            <label for="status">새로운 상태 *</label>
            <select id="status" v-model="statusUpdateForm.status" required>
              <option value="">상태를 선택하세요</option>
              <option value="reported">신고됨</option>
              <option value="investigating">조사 중</option>
              <option value="responding">대응 중</option>
              <option value="resolved">해결됨</option>
            </select>
          </div>

          <div class="form-group">
            <label for="notes">상태 변경 메모</label>
            <textarea 
              id="notes" 
              v-model="statusUpdateForm.notes"
              placeholder="상태 변경에 대한 추가 메모를 입력하세요"
              rows="3"
            ></textarea>
          </div>

          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn btn-secondary">
              취소
            </button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading">업데이트 중...</span>
              <span v-else>상태 변경</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Emergency Details Modal -->
    <div v-if="showDetailsModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content details-modal" @click.stop>
        <div class="modal-header">
          <h3>비상상황 상세 정보</h3>
          <button @click="closeModal" class="close-btn">&times;</button>
        </div>
        
        <div v-if="selectedEmergency" class="emergency-details">
          <div class="detail-section">
            <h4>기본 정보</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="label">유형:</span>
                <span class="value">{{ getEmergencyTypeText(selectedEmergency.type) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">우선순위:</span>
                <span class="value priority" :class="`priority-${selectedEmergency.priority}`">
                  {{ getPriorityText(selectedEmergency.priority) }}
                </span>
              </div>
              <div class="detail-item">
                <span class="label">현재 상태:</span>
                <span class="value status" :class="`status-${selectedEmergency.status}`">
                  {{ getResponseStatusText(selectedEmergency.status) }}
                </span>
              </div>
              <div class="detail-item">
                <span class="label">신고 시간:</span>
                <span class="value">{{ formatDate(selectedEmergency.reportedAt) }}</span>
              </div>
            </div>
          </div>
          
          <div class="detail-section">
            <h4>차량 정보</h4>
            <div class="vehicle-info">
              <div class="vehicle-image">
                <img 
                  :src="selectedEmergency.vehicleImage || '/default-vehicle.svg'" 
                  :alt="selectedEmergency.vehiclePlate || '차량 이미지'"
                  @error="handleImageError"
                />
              </div>
              <div class="vehicle-details">
              <div class="detail-item">
                  <span class="label">차량번호:</span>
                  <span class="value">{{ selectedEmergency.vehiclePlate || 'N/A' }}</span>
              </div>
              <div class="detail-item">
                  <span class="label">운전자:</span>
                  <span class="value">{{ selectedEmergency.driverName || 'N/A' }}</span>
              </div>
              <div class="detail-item">
                  <span class="label">위치:</span>
                  <span class="value">{{ selectedEmergency.location || 'N/A' }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="detail-section">
            <h4>상세 설명</h4>
            <div class="description">
              <p>{{ selectedEmergency.description }}</p>
            </div>
          </div>
          
          <div v-if="selectedEmergency.responseLogs && selectedEmergency.responseLogs.length > 0" class="detail-section">
            <h4>대응 기록</h4>
            <div class="response-logs">
              <div 
                v-for="log in selectedEmergency.responseLogs" 
                :key="log.id"
                class="log-item"
              >
                <div class="log-time">{{ formatDate(log.timestamp) }}</div>
                <div class="log-action">{{ log.action }}</div>
                <div class="log-details">{{ log.details }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import api from '../api'

// Reactive data
const loading = ref(false)
const showModal = ref(false)
const showStatusModal = ref(false)
const showDetailsModal = ref(false)
const statusFilter = ref('')
const selectedEmergency = ref<any>(null)
const statusUpdateForm = reactive({
  status: '',
  notes: ''
})

const stats = reactive({
  activeEmergencies: 0,
  resolvedToday: 0,
  avgResponseTime: 0,
  vehiclesInEmergency: 0
})

const emergencies = ref<any[]>([])

const emergencyForm = reactive({
  type: '',
  priority: 'medium',
  vehiclePlate: '',
  driverName: '',
  location: '',
  contactPhone: '',
  description: '',
  vehicleImage: null as File | null
})

// Methods
const loadEmergencies = async () => {
  try {
    loading.value = true
    const data = await api.getEmergencies()
    // Transform backend data to frontend format
    emergencies.value = data.map(emergency => ({
      id: emergency.emergency_id,
      vehiclePlate: emergency.vehicle_plate,
      driverName: emergency.driver_name,
      type: emergency.emergency_type,
      priority: emergency.priority,
      status: emergency.status,
      location: emergency.current_location,
      description: emergency.description,
      reportedAt: emergency.reported_at,
      responseTime: emergency.response_time_minutes,
      responseStatus: getResponseStatusText(emergency.status),
      responseStartedAt: emergency.response_started_at,
      resolvedAt: emergency.resolved_at,
      responseLogs: emergency.response_logs || []
    }))
  } catch (error) {
    console.error('Failed to load emergencies:', error)
    // Fallback to empty array if API fails
    emergencies.value = []
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  try {
    const data = await api.getEmergencyStats()
    stats.activeEmergencies = data.activeEmergencies || 0
    stats.resolvedToday = data.resolvedToday || 0
    stats.avgResponseTime = data.avgResponseTime || 0
    stats.vehiclesInEmergency = data.activeEmergencies || 0
  } catch (error) {
    console.error('Failed to load stats:', error)
    // Fallback to default values
    stats.activeEmergencies = 0
    stats.resolvedToday = 0
    stats.avgResponseTime = 0
    stats.vehiclesInEmergency = 0
  }
}

const openModal = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  showStatusModal.value = false
  showDetailsModal.value = false
  selectedEmergency.value = null
  // Reset form
  Object.assign(emergencyForm, {
    type: '',
    priority: 'medium',
    vehiclePlate: '',
    driverName: '',
    location: '',
    contactPhone: '',
    description: '',
    vehicleImage: null
  })
  // Reset status form
  Object.assign(statusUpdateForm, {
    status: '',
    notes: ''
  })
}

const handleSubmit = async () => {
  loading.value = true
  
  try {
    // Transform frontend form data to backend format
    const emergencyData = {
      emergency_type: emergencyForm.type,
      priority: emergencyForm.priority,
      vehicle_plate: emergencyForm.vehiclePlate,
      driver_name: emergencyForm.driverName,
      current_location: emergencyForm.location,
      description: emergencyForm.description,
      contact_phone: emergencyForm.contactPhone
    }
    
    await api.createEmergency(emergencyData)
    console.log('✅ Emergency created successfully')
    closeModal()
    await loadEmergencies()
    await loadStats()
  } catch (error) {
    console.error('❌ Failed to create emergency:', error)
    // You might want to show an error message to the user here
  } finally {
    loading.value = false
  }
}

const getEmergencyTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    'accident': '교통사고',
    'breakdown': '차량고장',
    'theft': '도난',
    'weather': '기상악화',
    'traffic': '교통체증',
    'other': '기타'
  }
  return typeMap[type] || type
}

const getPriorityText = (priority: string) => {
  const priorityMap: Record<string, string> = {
    'low': '낮음',
    'medium': '보통',
    'high': '높음',
    'critical': '긴급'
  }
  return priorityMap[priority] || priority
}

const getResponseStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'reported': '신고됨',
    'investigating': '조사 중',
    'responding': '대응 중',
    'resolved': '해결됨'
  }
  return statusMap[status] || status
}

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleString('ko-KR')
}

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    emergencyForm.vehicleImage = target.files[0]
  }
}

const getImagePreview = (file: File) => {
  return URL.createObjectURL(file)
}

const removeImage = () => {
  emergencyForm.vehicleImage = null
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = '/default-vehicle.svg'
}

const viewEmergencyDetails = (emergency: any) => {
  selectedEmergency.value = emergency
  showDetailsModal.value = true
}

const updateEmergencyStatus = (emergency: any) => {
  selectedEmergency.value = emergency
  showStatusModal.value = true
}

const handleStatusUpdate = async () => {
  if (!selectedEmergency.value || !statusUpdateForm.status) return
  
  try {
    loading.value = true
    
    const updateData = {
      status: statusUpdateForm.status,
      description: statusUpdateForm.notes ? 
        `${selectedEmergency.value.description}\n\n[상태 변경] ${statusUpdateForm.notes}` : 
        selectedEmergency.value.description
    }
    
    await api.updateEmergency(selectedEmergency.value.id, updateData)
    console.log('✅ Emergency status updated successfully')
    closeModal()
    await loadEmergencies()
    await loadStats()
  } catch (error) {
    console.error('❌ Failed to update emergency status:', error)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadEmergencies(),
    loadStats()
  ])
})
</script>

<style scoped>
.emergency-management {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.page-header p {
  color: #718096;
  font-size: 1.1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-icon svg {
  width: 30px;
  height: 30px;
}

.stat-icon.active { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%); }
.stat-icon.resolved { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.stat-icon.time { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.stat-icon.vehicles { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }

.stat-content h3 {
  font-size: 2rem;
  font-weight: bold;
  color: #2d3748;
  margin: 0;
}

.stat-content p {
  color: #718096;
  margin: 0;
  font-size: 0.9rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.btn svg {
  width: 20px;
  height: 20px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-secondary:hover {
  background: #cbd5e0;
}

.btn-outline {
  background: transparent;
  border: 2px solid #e2e8f0;
  color: #4a5568;
}

.btn-outline:hover {
  background: #e2e8f0;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.emergency-list {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.list-header h2 {
  color: #2d3748;
  margin: 0;
}

.filter-controls select {
  padding: 0.5rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
}

.loading {
  text-align: center;
  padding: 3rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #718096;
}

.empty-state svg {
  width: 64px;
  height: 64px;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.emergency-cards {
  display: grid;
  gap: 1rem;
}

.emergency-card {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s;
}

.emergency-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.emergency-card.priority-critical {
  border-left: 4px solid #e53e3e;
}

.emergency-card.priority-high {
  border-left: 4px solid #f56565;
}

.emergency-card.priority-medium {
  border-left: 4px solid #ed8936;
}

.emergency-card.priority-low {
  border-left: 4px solid #38a169;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.emergency-type {
  display: flex;
  gap: 0.5rem;
}

.type-badge {
  background: #667eea;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.priority-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.priority-badge.priority-critical {
  background: #fed7d7;
  color: #c53030;
}

.priority-badge.priority-high {
  background: #feebc8;
  color: #c05621;
}

.priority-badge.priority-medium {
  background: #bee3f8;
  color: #2b6cb0;
}

.priority-badge.priority-low {
  background: #c6f6d5;
  color: #2f855a;
}

.emergency-status {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.emergency-status.status-reported {
  background: #fed7d7;
  color: #c53030;
}

.emergency-status.status-investigating {
  background: #feebc8;
  color: #c05621;
}

.emergency-status.status-responding {
  background: #bee3f8;
  color: #2b6cb0;
}

.emergency-status.status-resolved {
  background: #c6f6d5;
  color: #2f855a;
}

.card-content {
  margin-bottom: 1rem;
}

.emergency-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.info-row {
  display: flex;
  gap: 0.5rem;
}

.info-row .label {
  font-weight: 600;
  color: #4a5568;
  min-width: 80px;
}

.info-row .value {
  color: #2d3748;
}

.emergency-description {
  background: #f7fafc;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.emergency-description p {
  margin: 0;
  color: #4a5568;
  line-height: 1.5;
}

.response-info {
  background: #e6fffa;
  padding: 0.75rem;
  border-radius: 8px;
}

.response-time {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.response-time .label {
  font-weight: 600;
  color: #234e52;
}

.response-time .value {
  color: #2c7a7b;
  font-weight: 600;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

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
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 2px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  color: #2d3748;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #718096;
}

.close-btn:hover {
  color: #2d3748;
}

.emergency-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #4a5568;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

/* Image Preview Styles */
.image-preview {
  position: relative;
  margin-top: 1rem;
  display: inline-block;
}

.image-preview img {
  width: 150px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
}

.remove-image-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ef4444;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
}

/* Details Modal Styles */
.details-modal {
  max-width: 800px;
  max-height: 90vh;
}

.emergency-details {
  padding: 1.5rem;
}

.detail-section {
  margin-bottom: 2rem;
}

.detail-section h4 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e2e8f0;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.detail-item .label {
  font-weight: 600;
  color: #4a5568;
}

.detail-item .value {
  color: #2d3748;
  font-weight: 500;
}

.detail-item .value.priority {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.detail-item .value.status {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

/* Vehicle Info Styles */
.vehicle-info {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.vehicle-image {
  flex-shrink: 0;
}

.vehicle-image img {
  width: 200px;
  height: 150px;
  object-fit: cover;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
}

.vehicle-details {
  flex: 1;
}

/* Description Styles */
.description {
  background: #f7fafc;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.description p {
  margin: 0;
  color: #4a5568;
  line-height: 1.6;
}

/* Response Logs Styles */
.response-logs {
  max-height: 300px;
  overflow-y: auto;
}

.log-item {
  background: #f7fafc;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  border-left: 4px solid #38a169;
}

.log-time {
  font-size: 0.8rem;
  color: #718096;
  margin-bottom: 0.25rem;
}

.log-action {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.log-details {
  color: #4a5568;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .emergency-management {
    padding: 1rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .emergency-info {
    grid-template-columns: 1fr;
  }
  
  .card-actions {
    flex-direction: column;
  }
  
  .modal-content {
    width: 95%;
    margin: 1rem;
  }
  
  .vehicle-info {
    flex-direction: column;
  }
  
  .vehicle-image img {
    width: 100%;
    height: 200px;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
