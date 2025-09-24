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
                      <div class="vehicle-model">{{ asset.model || '모델 정보 없음' }}</div>
                    </div>
                  </div>
                </td>
                
                <td class="type-cell">
                  <span class="type-badge">{{ asset.asset_type }}</span>
                </td>
                
                <td class="capacity-cell">
                  <span class="capacity-text">{{ asset.capacity ? `${asset.capacity}톤` : '정보 없음' }}</span>
                </td>
                
                <td class="status-cell">
                  <span :class="['status-badge', `status-${asset.status.toLowerCase()}`]">
                    {{ getKoreanStatusText(asset.status) }}
                  </span>
                </td>
                
                <td class="branch-cell">
                  <span class="branch-text">{{ asset.branch_name || '지점 정보 없음' }}</span>
                </td>
                
                <td class="driver-cell">
                  <span class="driver-text">{{ asset.driver_name || '미배정' }}</span>
                </td>
                
                <td class="location-cell">
                  <div class="location-info">
                    <svg class="location-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span class="location-text">{{ asset.current_location || '위치 정보 없음' }}</span>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import api from '../api'

const loading = ref(false)
const assets = ref([])
const showFilters = ref(false)

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

const filteredAssets = computed(() => {
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
  await Promise.all([
    loadAssets(),
    loadStats()
  ])
})

const loadAssets = async () => {
  try {
    loading.value = true
    const data = await api.getKoreanAssets()
    assets.value = data
  } catch (error) {
    console.error('Failed to load assets:', error)
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  try {
    const data = await api.getKoreanTmsStats()
    stats.value = {
      totalAssets: data.assets || 0,
      availableAssets: data.availableAssets || 0,
      inUseAssets: data.inUseAssets || 0,
      maintenanceAssets: data.maintenanceAssets || 0,
      activeAssets: data.activeAssets || 0
    }
  } catch (error) {
    console.error('Failed to load stats:', error)
  }
}

const refreshData = async () => {
  await Promise.all([
    loadAssets(),
    loadStats()
  ])
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

const getKoreanStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'AVAILABLE': '사용가능',
    'IN_USE': '사용중',
    'MAINTENANCE': '정비중',
    'OUT_OF_SERVICE': '운행중단'
  }
  return statusMap[status] || status
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
</style>