<template>
  <div class="tracking-page">
    <!-- Modern Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-title">
          <h1>운송 현황</h1>
          <p class="subtitle">Transportation Status Monitoring</p>
        </div>
        <div class="header-actions">
          <button class="refresh-btn" @click="refreshData">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="23,4 23,10 17,10"></polyline>
              <polyline points="1,20 1,14 7,14"></polyline>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
            </svg>
            새로고침
          </button>
        </div>
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

    <!-- Vehicle Information Panel -->
    <div class="panel-container">
      <div class="panel-header">
        <h3>운송차량정보</h3>
        <div class="panel-actions">
          <button class="filter-btn" @click="toggleFilters">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"></polygon>
            </svg>
            필터
          </button>
        </div>
      </div>
      
      <!-- Filters (collapsible) -->
      <div v-if="showFilters" class="filters-section">
        <div class="filters-grid">
          <div class="filter-group">
            <label>차량 상태</label>
            <select v-model="filters.status" class="modern-select">
              <option value="">전체 상태</option>
              <option value="AVAILABLE">사용가능</option>
              <option value="IN_USE">사용중</option>
              <option value="MAINTENANCE">정비중</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>차량 유형</label>
            <select v-model="filters.assetType" class="modern-select">
              <option value="">전체 유형</option>
              <option value="트럭">트럭</option>
              <option value="밴">밴</option>
              <option value="특수차량">특수차량</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>지점</label>
            <select v-model="filters.branch" class="modern-select">
              <option value="">전체 지점</option>
              <option value="서울지점">서울지점</option>
              <option value="부산지점">부산지점</option>
              <option value="대구지점">대구지점</option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- Vehicle Table -->
      <div class="table-container">
        <div class="table-wrapper">
          <table class="modern-table">
            <thead>
              <tr>
                <th>차량번호</th>
                <th>차량유형</th>
                <th>적재량</th>
                <th>상태</th>
                <th>지점</th>
                <th>운전자</th>
                <th>현재위치</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="asset in filteredAssets" :key="asset.asset_id" class="table-row">
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
                      <div class="vehicle-number">{{ asset.license_plate }}</div>
                      <div class="vehicle-model">{{ asset.asset_name || '모델 정보 없음' }}</div>
                    </div>
                  </div>
                </td>
                
                <td class="type-cell">
                  <span class="type-badge">{{ asset.asset_type }}</span>
                </td>
                
                <td class="capacity-cell">
                  <span class="capacity-text">{{ asset.asset_type === '트럭' ? '2.5톤' : '정보 없음' }}</span>
                </td>
                
                <td class="status-cell">
                  <span :class="['status-badge', `status-${asset.status.toLowerCase()}`]">
                    {{ getKoreanStatusText(asset.status) }}
                  </span>
                </td>
                
                <td class="branch-cell">
                  <span class="branch-text">{{ getBranchName(asset.branch_id) }}</span>
                </td>
                
                <td class="driver-cell">
                  <span class="driver-text">{{ '미배정' }}</span>
                </td>
                
                <td class="location-cell">
                  <div class="location-info">
                    <svg class="location-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span class="location-text">{{ getBranchLocation(asset.branch_id) }}</span>
                  </div>
                </td>
                
                <td class="actions-cell">
                  <div class="action-buttons">
                    <button @click="viewAssetDetails(asset)" class="action-btn view-btn">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                    <button @click="editAsset(asset)" class="action-btn edit-btn">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button @click="trackAsset(asset)" class="action-btn track-btn">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                        <path d="M2 17l10 5 10-5"></path>
                        <path d="M2 12l10 5 10-5"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Empty State -->
        <div v-if="filteredAssets.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 11l-1.5-1.5c-.8-.8-2-1.2-3.2-1.2H9.7c-1.2 0-2.4.4-3.2 1.2L5 11l-.5.1C3.7 11.3 3 12.1 3 13v3c0 .6.4 1 1 1h2"></path>
              <circle cx="7" cy="17" r="2"></circle>
              <circle cx="17" cy="17" r="2"></circle>
            </svg>
          </div>
          <h3>차량 정보가 없습니다</h3>
          <p>필터를 조정하거나 데이터를 새로고침해보세요.</p>
        </div>
      </div>
    </div>

    <!-- Edit Asset Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeModals">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>차량 정보 수정</h2>
          <button @click="closeModals" class="close-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="updateAsset" class="modal-form">
          <div class="form-group">
            <label>차량명</label>
            <input v-model="selectedAsset.asset_name" type="text" required class="form-input" />
          </div>
          
          <div class="form-group">
            <label>차량 유형</label>
            <input v-model="selectedAsset.asset_type" type="text" required class="form-input" />
          </div>
          
          <div class="form-group">
            <label>번호판</label>
            <input v-model="selectedAsset.license_plate" type="text" required class="form-input" />
          </div>
          
          <div class="form-group">
            <label>상태</label>
            <select v-model="selectedAsset.status" class="form-select">
              <option value="AVAILABLE">사용가능</option>
              <option value="IN_USE">사용중</option>
              <option value="MAINTENANCE">정비중</option>
              <option value="OUT_OF_SERVICE">운행중단</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>지점</label>
            <select v-model="selectedAsset.branch_id" class="form-select">
              <option value="1">서울지점</option>
              <option value="2">부산지점</option>
              <option value="3">대구지점</option>
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

const loading = ref(false)
const assets = ref<{ asset_id: number; asset_type: string; license_plate: string; asset_name?: string; status: string; branch_id: number; branch_name?: string }[]>([])
const showFilters = ref(false)
const showEditModal = ref(false)
const selectedAsset = ref<any>(null)

const filters = reactive({
  status: '',
  assetType: '',
  branch: ''
})

const stats = ref({
  totalAssets: 0,
  availableAssets: 0,
  inUseAssets: 0,
  maintenanceAssets: 0,
  activeAssets: 0
})

const statsData = computed(() => [
  {
    key: 'total',
    label: '전체 차량',
    value: stats.value.totalAssets,
    iconClass: 'total',
    iconPath: 'M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 11l-1.5-1.5c-.8-.8-2-1.2-3.2-1.2H9.7c-1.2 0-2.4.4-3.2 1.2L5 11l-.5.1C3.7 11.3 3 12.1 3 13v3c0 .6.4 1 1 1h2'
  },
  {
    key: 'available',
    label: '사용가능',
    value: stats.value.availableAssets,
    iconClass: 'available',
    iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    key: 'inUse',
    label: '사용중',
    value: stats.value.inUseAssets,
    iconClass: 'inUse',
    iconPath: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4'
  },
  {
    key: 'maintenance',
    label: '정비중',
    value: stats.value.maintenanceAssets,
    iconClass: 'maintenance',
    iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
  },
  {
    key: 'active',
    label: '활성 차량',
    value: stats.value.activeAssets,
    iconClass: 'active',
    iconPath: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z'
  }
])

const filteredAssets = computed<{ asset_id: number; asset_type: string; license_plate: string; asset_name?: string; status: string; branch_id: number; branch_name?: string }[]>(() => {
  let filtered = assets.value
  
  if (filters.status) {
    filtered = filtered.filter((asset: any) => 
      asset.status === filters.status
    )
  }
  
  if (filters.assetType) {
    filtered = filtered.filter((asset: any) => 
      asset.asset_type === filters.assetType
    )
  }
  
  if (filters.branch) {
    filtered = filtered.filter((asset: any) => 
      asset.branch_name === filters.branch
    )
  }
  
  return filtered
})

onMounted(async () => {
  await loadAssets()
})

const loadAssets = async () => {
  try {
    loading.value = true
    const data = await api.getKoreanAssets()
    assets.value = data
    // Calculate stats after assets are loaded
    await loadStats()
  } catch (error) {
    console.error('Failed to load assets:', error)
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  try {
    // Calculate stats from actual assets data
    const totalAssets = assets.value.length
    const availableAssets = assets.value.filter(asset => asset.status === 'AVAILABLE').length
    const inUseAssets = assets.value.filter(asset => asset.status === 'IN_USE' || asset.status === 'ASSIGNED').length
    const maintenanceAssets = assets.value.filter(asset => asset.status === 'MAINTENANCE').length
    const activeAssets = assets.value.filter(asset => asset.status !== 'OUT_OF_SERVICE').length
    
    stats.value = {
      totalAssets,
      availableAssets,
      inUseAssets,
      maintenanceAssets,
      activeAssets
    }
  } catch (error) {
    console.error('Failed to load stats:', error)
  }
}

const refreshData = async () => {
  await loadAssets()
}

const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

const viewAssetDetails = (asset: any) => {
  console.log('View asset details:', asset)
}

const trackAsset = (asset: any) => {
  console.log('Track asset:', asset)
}

const editAsset = (asset: any) => {
  selectedAsset.value = { ...asset }
  showEditModal.value = true
}

const updateAsset = async () => {
  try {
    loading.value = true
    await api.createKoreanAsset(selectedAsset.value)
    await loadAssets()
    closeModals()
    console.log('✅ Asset updated successfully')
  } catch (error) {
    console.error('❌ Failed to update asset:', error)
  } finally {
    loading.value = false
  }
}

const closeModals = () => {
  showEditModal.value = false
  selectedAsset.value = null
}

const getKoreanStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'AVAILABLE': '사용가능',
    'IN_USE': '사용중',
    'MAINTENANCE': '정비중',
    'OUT_OF_SERVICE': '운행중단'
  }
  return statusMap[status] || status
}

const getBranchName = (branchId: number) => {
  const branchMap: Record<number, string> = {
    1: '서울지점',
    2: '부산지점',
    3: '대구지점'
  }
  return branchMap[branchId] || '지점 정보 없음'
}

const getBranchLocation = (branchId: number) => {
  const locationMap: Record<number, string> = {
    1: '서울특별시 강남구',
    2: '부산광역시 해운대구',
    3: '대구광역시 수성구'
  }
  return locationMap[branchId] || '위치 정보 없음'
}
</script>

<style scoped>
.tracking-page {
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

.refresh-btn {
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

.refresh-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px rgba(102, 126, 234, 0.4);
}

.refresh-btn .icon {
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
.stat-icon.inUse { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.stat-icon.maintenance { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
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

/* Panel Container */
.panel-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.panel-header {
  padding: 2rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header h3 {
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

/* Filters Section */
.filters-section {
  padding: 2rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
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

.modern-select {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  background: white;
}

.modern-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Table */
.table-container {
  padding: 2rem;
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

.vehicle-number {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.vehicle-model {
  color: #6b7280;
  font-size: 0.9rem;
}

.type-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: #e0e7ff;
  color: #3730a3;
}

.capacity-text {
  font-weight: 500;
  color: #374151;
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

.status-in_use {
  background: #dbeafe;
  color: #1e40af;
}

.status-maintenance {
  background: #fef3c7;
  color: #92400e;
}

.status-out_of_service {
  background: #fee2e2;
  color: #991b1b;
}

.branch-text,
.driver-text {
  font-weight: 500;
  color: #374151;
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

.view-btn {
  background: #d1fae5;
  color: #065f46;
}

.view-btn:hover {
  background: #a7f3d0;
  color: #047857;
}

.track-btn {
  background: #dbeafe;
  color: #1e40af;
}

.track-btn:hover {
  background: #bfdbfe;
  color: #1e3a8a;
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
  .tracking-page {
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
  
  .table-wrapper {
    overflow-x: scroll;
  }
  
  .modern-table {
    min-width: 1000px;
  }
}

.edit-btn {
  background: #fef3c7;
  color: #d97706;
}

.edit-btn:hover {
  background: #fde68a;
  color: #b45309;
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