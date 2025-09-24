<template>
  <div class="emergency-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-left">
        <h1>비상 상황 관리 (Emergency Situation Management)</h1>
        <p class="page-subtitle">긴급 상황 등록 및 관리 시스템</p>
      </div>
      <div class="header-actions">
        <button @click="showCreateModal = true" class="btn btn-danger">
          <i class="icon">🚨</i>
          비상 상황 등록
        </button>
      </div>
    </div>

    <!-- Emergency Statistics -->
    <div class="stats-grid">
      <div class="stat-card emergency">
        <div class="stat-icon">🚨</div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.activeEmergencies }}</div>
          <div class="stat-label">활성 비상상황</div>
        </div>
      </div>
      <div class="stat-card resolved">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.resolvedToday }}</div>
          <div class="stat-label">오늘 해결</div>
        </div>
      </div>
      <div class="stat-card response">
        <div class="stat-icon">⚡</div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.avgResponseTime }}분</div>
          <div class="stat-label">평균 대응시간</div>
        </div>
      </div>
      <div class="stat-card vehicles">
        <div class="stat-icon">🚛</div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.vehiclesInEmergency }}</div>
          <div class="stat-label">비상 차량</div>
        </div>
      </div>
    </div>

    <!-- Emergency List -->
    <div class="emergency-section">
      <div class="section-header">
        <h2>비상 상황 목록 (Emergency List)</h2>
        <div class="filter-controls">
          <select v-model="filters.status" class="filter-select">
            <option value="">전체 상태</option>
            <option value="reported">신고됨</option>
            <option value="investigating">조사 중</option>
            <option value="responding">대응 중</option>
            <option value="resolved">해결됨</option>
          </select>
          <select v-model="filters.priority" class="filter-select">
            <option value="">전체 우선순위</option>
            <option value="low">낮음</option>
            <option value="medium">보통</option>
            <option value="high">높음</option>
            <option value="critical">긴급</option>
          </select>
          <input 
            v-model="filters.search" 
            type="text" 
            placeholder="차량번호 또는 상황 검색" 
            class="filter-input"
          />
        </div>
      </div>

      <!-- Emergency Table -->
      <div class="emergency-table-container">
        <table class="emergency-table">
          <thead>
            <tr>
              <th>상황 ID</th>
              <th>차량 정보</th>
              <th>상황 유형</th>
              <th>우선순위</th>
              <th>상태</th>
              <th>신고 시간</th>
              <th>대응 시간</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="emergency in filteredEmergencies" :key="emergency.id" class="emergency-row">
              <td class="emergency-id">
                <div class="id-number">#{{ emergency.id }}</div>
                <div class="id-type">{{ emergency.type }}</div>
              </td>
              <td class="vehicle-info">
                <div class="vehicle-details">
                  <div class="vehicle-plate">{{ emergency.vehiclePlate }}</div>
                  <div class="vehicle-driver">{{ emergency.driverName }}</div>
                  <div class="vehicle-location">{{ emergency.location }}</div>
                </div>
              </td>
              <td class="situation-type">
                <span :class="['type-badge', `type-${emergency.type.toLowerCase()}`]">
                  {{ getKoreanTypeText(emergency.type) }}
                </span>
              </td>
              <td class="priority">
                <span :class="['priority-badge', `priority-${emergency.priority}`]">
                  {{ getKoreanPriorityText(emergency.priority) }}
                </span>
              </td>
              <td class="status">
                <span :class="['status-badge', `status-${emergency.status}`]">
                  {{ getKoreanStatusText(emergency.status) }}
                </span>
              </td>
              <td class="report-time">
                <div class="time-details">
                  <div class="time">{{ formatTime(emergency.reportedAt) }}</div>
                  <div class="date">{{ formatDate(emergency.reportedAt) }}</div>
                </div>
              </td>
              <td class="response-time">
                <div v-if="emergency.responseTime" class="response-details">
                  <div class="time">{{ emergency.responseTime }}분</div>
                  <div class="status">{{ emergency.responseStatus }}</div>
                </div>
                <div v-else class="no-response">
                  대기 중
                </div>
              </td>
              <td class="actions">
                <div class="action-buttons">
                  <button @click="viewEmergencyDetails(emergency)" class="btn btn-sm btn-outline">
                    <i class="icon">👁️</i>
                    상세
                  </button>
                  <button @click="updateEmergencyStatus(emergency)" class="btn btn-sm btn-primary">
                    <i class="icon">📝</i>
                    업데이트
                  </button>
                  <button @click="contactEmergencyTeam(emergency)" class="btn btn-sm btn-danger">
                    <i class="icon">📞</i>
                    연락
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Empty State -->
        <div v-if="filteredEmergencies.length === 0" class="empty-state">
          <div class="empty-icon">🚨</div>
          <h3>비상 상황이 없습니다</h3>
          <p>현재 등록된 비상 상황이 없거나 필터 조건에 맞는 상황이 없습니다.</p>
        </div>
      </div>
    </div>

    <!-- Create Emergency Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>비상 상황 등록</h2>
          <button @click="closeModal" class="close-btn">✕</button>
        </div>
        
        <form @submit.prevent="handleSubmit" class="modal-form">
          <div class="form-row">
            <div class="form-group">
              <label>차량번호 *</label>
              <input v-model="emergencyForm.vehiclePlate" type="text" required placeholder="예: 서울 12가 3456" />
            </div>
            <div class="form-group">
              <label>운전자명 *</label>
              <input v-model="emergencyForm.driverName" type="text" required placeholder="운전자 이름" />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>상황 유형 *</label>
              <select v-model="emergencyForm.type" required>
                <option value="">선택하세요</option>
                <option value="accident">사고</option>
                <option value="breakdown">고장</option>
                <option value="theft">도난</option>
                <option value="weather">기상악화</option>
                <option value="traffic">교통체증</option>
                <option value="other">기타</option>
              </select>
            </div>
            <div class="form-group">
              <label>우선순위 *</label>
              <select v-model="emergencyForm.priority" required>
                <option value="">선택하세요</option>
                <option value="low">낮음</option>
                <option value="medium">보통</option>
                <option value="high">높음</option>
                <option value="critical">긴급</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label>현재 위치 *</label>
            <input v-model="emergencyForm.location" type="text" required placeholder="현재 위치를 입력하세요" />
          </div>
          
          <div class="form-group">
            <label>상황 설명 *</label>
            <textarea v-model="emergencyForm.description" rows="4" required placeholder="상황을 자세히 설명해주세요"></textarea>
          </div>
          
          <div class="form-group">
            <label>연락처</label>
            <input v-model="emergencyForm.contactPhone" type="tel" placeholder="연락 가능한 전화번호" />
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn btn-secondary">취소</button>
            <button type="submit" :disabled="loading" class="btn btn-danger">
              {{ loading ? '등록 중...' : '비상 상황 등록' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Emergency Details Modal -->
    <div v-if="showDetailsModal && selectedEmergency" class="modal-overlay" @click="closeModal">
      <div class="modal large-modal" @click.stop>
        <div class="modal-header">
          <h2>비상 상황 상세 정보</h2>
          <button @click="closeModal" class="close-btn">✕</button>
        </div>
        
        <div class="emergency-details">
          <div class="detail-section">
            <h3>기본 정보</h3>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="label">상황 ID:</span>
                <span class="value">#{{ selectedEmergency.id }}</span>
              </div>
              <div class="detail-item">
                <span class="label">차량번호:</span>
                <span class="value">{{ selectedEmergency.vehiclePlate }}</span>
              </div>
              <div class="detail-item">
                <span class="label">운전자:</span>
                <span class="value">{{ selectedEmergency.driverName }}</span>
              </div>
              <div class="detail-item">
                <span class="label">상황 유형:</span>
                <span class="value">{{ getKoreanTypeText(selectedEmergency.type) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">우선순위:</span>
                <span class="value">{{ getKoreanPriorityText(selectedEmergency.priority) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">현재 상태:</span>
                <span class="value">{{ getKoreanStatusText(selectedEmergency.status) }}</span>
              </div>
            </div>
          </div>
          
          <div class="detail-section">
            <h3>시간 정보</h3>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="label">신고 시간:</span>
                <span class="value">{{ formatDateTime(selectedEmergency.reportedAt) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">대응 시작:</span>
                <span class="value">{{ selectedEmergency.responseStartedAt ? formatDateTime(selectedEmergency.responseStartedAt) : '대기 중' }}</span>
              </div>
              <div class="detail-item">
                <span class="label">해결 시간:</span>
                <span class="value">{{ selectedEmergency.resolvedAt ? formatDateTime(selectedEmergency.resolvedAt) : '미해결' }}</span>
              </div>
              <div class="detail-item">
                <span class="label">대응 시간:</span>
                <span class="value">{{ selectedEmergency.responseTime ? selectedEmergency.responseTime + '분' : '계산 중' }}</span>
              </div>
            </div>
          </div>
          
          <div class="detail-section">
            <h3>상황 설명</h3>
            <div class="description-content">
              {{ selectedEmergency.description }}
            </div>
          </div>
          
          <div class="detail-section">
            <h3>대응 기록</h3>
            <div class="response-timeline">
              <div v-for="log in selectedEmergency.responseLogs" :key="log.id" class="timeline-item">
                <div class="timeline-time">{{ formatTime(log.timestamp) }}</div>
                <div class="timeline-content">
                  <div class="timeline-action">{{ log.action }}</div>
                  <div class="timeline-details">{{ log.details }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import api from '../api'

const showCreateModal = ref(false)
const showDetailsModal = ref(false)
const selectedEmergency = ref<any>(null)
const loading = ref(false)
const emergencies = ref([])

const filters = reactive({
  status: '',
  priority: '',
  search: ''
})

const stats = ref({
  activeEmergencies: 0,
  resolvedToday: 0,
  avgResponseTime: 0,
  vehiclesInEmergency: 0
})

const emergencyForm = reactive({
  vehiclePlate: '',
  driverName: '',
  type: '',
  priority: '',
  location: '',
  description: '',
  contactPhone: ''
})

const filteredEmergencies = computed(() => {
  let filtered = emergencies.value
  
  if (filters.status) {
    filtered = filtered.filter((emergency: any) => emergency.status === filters.status)
  }
  
  if (filters.priority) {
    filtered = filtered.filter((emergency: any) => emergency.priority === filters.priority)
  }
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter((emergency: any) => 
      emergency.vehiclePlate.toLowerCase().includes(searchLower) ||
      emergency.driverName.toLowerCase().includes(searchLower) ||
      emergency.description.toLowerCase().includes(searchLower)
    )
  }
  
  return filtered
})

onMounted(async () => {
  await Promise.all([
    loadEmergencies(),
    loadStats()
  ])
})

const loadEmergencies = async () => {
  try {
    loading.value = true
    // Mock data for now - would be replaced with actual API call
    emergencies.value = [
      {
        id: 1,
        vehiclePlate: '서울 12가 3456',
        driverName: '김운전',
        type: 'accident',
        priority: 'high',
        status: 'investigating',
        location: '서울특별시 강남구 테헤란로',
        description: '교통사고 발생, 차량 손상 심각',
        reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        responseTime: 15,
        responseStatus: '대응 중',
        responseLogs: [
          {
            id: 1,
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            action: '신고 접수',
            details: '비상 상황 신고가 접수되었습니다.'
          },
          {
            id: 2,
            timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
            action: '대응팀 파견',
            details: '긴급 대응팀이 현장으로 출동했습니다.'
          }
        ]
      },
      {
        id: 2,
        vehiclePlate: '서울 34나 5678',
        driverName: '이기사',
        type: 'breakdown',
        priority: 'medium',
        status: 'responding',
        location: '경기도 성남시 분당구',
        description: '엔진 고장으로 차량 정지',
        reportedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        responseTime: 8,
        responseStatus: '수리 중',
        responseLogs: [
          {
            id: 1,
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            action: '신고 접수',
            details: '차량 고장 신고가 접수되었습니다.'
          }
        ]
      }
    ]
  } catch (error) {
    console.error('Failed to load emergencies:', error)
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  try {
    // Mock stats - would be replaced with actual API call
    stats.value = {
      activeEmergencies: 3,
      resolvedToday: 5,
      avgResponseTime: 12,
      vehiclesInEmergency: 2
    }
  } catch (error) {
    console.error('Failed to load stats:', error)
  }
}

const viewEmergencyDetails = (emergency: any) => {
  selectedEmergency.value = emergency
  showDetailsModal.value = true
}

const updateEmergencyStatus = (emergency: any) => {
  console.log('Update emergency status:', emergency.id)
  // This would open a status update modal
}

const contactEmergencyTeam = (emergency: any) => {
  console.log('Contact emergency team for:', emergency.id)
  // This would initiate contact with emergency response team
}

const closeModal = () => {
  showCreateModal.value = false
  showDetailsModal.value = false
  selectedEmergency.value = null
  
  // Reset form
  Object.assign(emergencyForm, {
    vehiclePlate: '',
    driverName: '',
    type: '',
    priority: '',
    location: '',
    description: '',
    contactPhone: ''
  })
}

const handleSubmit = async () => {
  loading.value = true
  
  try {
    // Note: This would need a create endpoint in the backend
    console.log('Create emergency:', emergencyForm)
    closeModal()
    await loadEmergencies()
    await loadStats()
  } catch (error) {
    console.error('Failed to create emergency:', error)
  } finally {
    loading.value = false
  }
}

const getKoreanTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    'accident': '사고',
    'breakdown': '고장',
    'theft': '도난',
    'weather': '기상악화',
    'traffic': '교통체증',
    'other': '기타'
  }
  return typeMap[type] || type
}

const getKoreanPriorityText = (priority: string) => {
  const priorityMap: Record<string, string> = {
    'low': '낮음',
    'medium': '보통',
    'high': '높음',
    'critical': '긴급'
  }
  return priorityMap[priority] || priority
}

const getKoreanStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'reported': '신고됨',
    'investigating': '조사 중',
    'responding': '대응 중',
    'resolved': '해결됨'
  }
  return statusMap[status] || status
}

const formatDateTime = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('ko-KR')
}

const formatTime = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleTimeString('ko-KR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR')
}
</script>

<style scoped>
.emergency-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-left h1 {
  color: #333;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: #666;
  font-size: 1.1rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
}

.stat-card.emergency {
  border-left: 4px solid #dc3545;
}

.stat-card.resolved {
  border-left: 4px solid #28a745;
}

.stat-card.response {
  border-left: 4px solid #ffc107;
}

.stat-card.vehicles {
  border-left: 4px solid #17a2b8;
}

.stat-icon {
  font-size: 2rem;
  margin-right: 1rem;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.25rem;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

.emergency-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.section-header h2 {
  color: #333;
  font-size: 1.5rem;
  margin: 0;
}

.filter-controls {
  display: flex;
  gap: 1rem;
}

.filter-select,
.filter-input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
}

.filter-input {
  min-width: 200px;
}

.emergency-table-container {
  overflow-x: auto;
}

.emergency-table {
  width: 100%;
  border-collapse: collapse;
}

.emergency-table th,
.emergency-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.emergency-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.emergency-row:hover {
  background: #f8f9fa;
}

.emergency-id {
  font-weight: 500;
}

.id-number {
  color: #333;
  font-size: 1.1rem;
}

.id-type {
  color: #666;
  font-size: 0.8rem;
}

.vehicle-details {
  display: flex;
  flex-direction: column;
}

.vehicle-plate {
  font-weight: 500;
  color: #333;
}

.vehicle-driver {
  color: #666;
  font-size: 0.9rem;
}

.vehicle-location {
  color: #666;
  font-size: 0.8rem;
}

.type-badge,
.priority-badge,
.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.type-accident { background: #f8d7da; color: #721c24; }
.type-breakdown { background: #fff3cd; color: #856404; }
.type-theft { background: #d1ecf1; color: #0c5460; }
.type-weather { background: #e2e3e5; color: #383d41; }
.type-traffic { background: #d4edda; color: #155724; }
.type-other { background: #f8f9fa; color: #495057; }

.priority-low { background: #d1ecf1; color: #0c5460; }
.priority-medium { background: #fff3cd; color: #856404; }
.priority-high { background: #f8d7da; color: #721c24; }
.priority-critical { background: #721c24; color: white; }

.status-reported { background: #fff3cd; color: #856404; }
.status-investigating { background: #d1ecf1; color: #0c5460; }
.status-responding { background: #d4edda; color: #155724; }
.status-resolved { background: #cce5ff; color: #004085; }

.time-details {
  display: flex;
  flex-direction: column;
}

.time {
  font-weight: 500;
  color: #333;
}

.date {
  color: #666;
  font-size: 0.8rem;
}

.response-details {
  display: flex;
  flex-direction: column;
}

.response-details .time {
  font-weight: 500;
  color: #28a745;
}

.response-details .status {
  color: #666;
  font-size: 0.8rem;
}

.no-response {
  color: #999;
  font-style: italic;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-outline {
  background: transparent;
  color: #007bff;
  border: 1px solid #007bff;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}

.btn:hover {
  opacity: 0.8;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin-bottom: 0.5rem;
  color: #333;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal.large-modal {
  max-width: 800px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
}

.modal-form {
  padding: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.emergency-details {
  padding: 1.5rem;
}

.detail-section {
  margin-bottom: 2rem;
}

.detail-section h3 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
}

.detail-item .label {
  font-weight: 500;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.detail-item .value {
  color: #333;
  font-size: 1rem;
}

.description-content {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  color: #333;
  line-height: 1.5;
}

.response-timeline {
  border-left: 2px solid #eee;
  padding-left: 1rem;
}

.timeline-item {
  margin-bottom: 1rem;
  position: relative;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -1.5rem;
  top: 0.5rem;
  width: 8px;
  height: 8px;
  background: #007bff;
  border-radius: 50%;
}

.timeline-time {
  font-weight: 500;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.timeline-action {
  font-weight: 500;
  color: #333;
  margin-bottom: 0.25rem;
}

.timeline-details {
  color: #666;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .filter-controls {
    flex-direction: column;
  }
  
  .emergency-table {
    font-size: 0.8rem;
  }
  
  .emergency-table th,
  .emergency-table td {
    padding: 0.5rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .modal {
    width: 95%;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>
