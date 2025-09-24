<template>
  <div class="tracking-page">
    <div class="page-header">
      <h1>📍 Order Tracking</h1>
      <p class="page-subtitle">Real-time order status and location tracking</p>
    </div>

    <!-- Live Orders -->
    <div class="tracking-section">
      <h2>🚛 Active Orders</h2>
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading active orders...</p>
      </div>
      
      <div v-else-if="trackingOrders.length === 0" class="no-orders">
        <div class="no-orders-icon">📭</div>
        <h3>No Active Orders</h3>
        <p>There are currently no orders being tracked.</p>
      </div>
      
      <div v-else class="orders-grid">
        <div v-for="order in trackingOrders" :key="order.id" class="order-card">
          <div class="order-header">
            <div class="order-id">Order #{{ order.id }}</div>
            <div class="order-status">
              <span :class="['status-badge', `status-${order.status}`]">
                {{ order.status }}
              </span>
            </div>
          </div>
          
          <div class="order-info">
            <div class="customer-info">
              <h3>{{ order.customerName }}</h3>
              <p>{{ order.customerPhone }}</p>
            </div>
            
            <div class="route-info">
              <div class="route-point pickup">
                <div class="point-icon">📍</div>
                <div class="point-details">
                  <div class="point-label">Pickup</div>
                  <div class="point-address">{{ order.pickupLocation }}</div>
                </div>
              </div>
              
              <div class="route-line"></div>
              
              <div class="route-point dropoff">
                <div class="point-icon">🏁</div>
                <div class="point-details">
                  <div class="point-label">Dropoff</div>
                  <div class="point-address">{{ order.dropoffLocation }}</div>
                </div>
              </div>
            </div>
            
            <div class="driver-info" v-if="order.driver">
              <div class="driver-avatar">
                {{ order.driver.name.charAt(0).toUpperCase() }}
              </div>
              <div class="driver-details">
                <div class="driver-name">{{ order.driver.name }}</div>
                <div class="driver-vehicle">{{ order.driver.vehicle }}</div>
                <div class="driver-phone">{{ order.driver.phone }}</div>
              </div>
            </div>
            
            <div class="order-meta">
              <div class="meta-item" v-if="order.estimatedFare">
                <span class="meta-label">Estimated Fare:</span>
                <span class="meta-value">${{ order.estimatedFare }}</span>
              </div>
              <div class="meta-item" v-if="order.scheduledPickupTime">
                <span class="meta-label">Scheduled:</span>
                <span class="meta-value">{{ formatDateTime(order.scheduledPickupTime) }}</span>
              </div>
            </div>
          </div>
          
          <div class="order-progress">
            <div class="progress-bar">
              <div 
                :class="['progress-fill', `progress-${order.status}`]"
                :style="{ width: getProgressWidth(order.status) }"
              ></div>
            </div>
            <div class="progress-labels">
              <span :class="{ active: ['pending', 'assigned', 'in_progress', 'completed'].includes(order.status) }">
                Pending
              </span>
              <span :class="{ active: ['assigned', 'in_progress', 'completed'].includes(order.status) }">
                Assigned
              </span>
              <span :class="{ active: ['in_progress', 'completed'].includes(order.status) }">
                In Progress
              </span>
              <span :class="{ active: order.status === 'completed' }">
                Completed
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Statistics -->
    <div class="stats-section">
      <h2>📊 Order Statistics</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📋</div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.totalOrders || 0 }}</div>
            <div class="stat-label">Total Orders</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⏳</div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.pendingOrders || 0 }}</div>
            <div class="stat-label">Pending</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🚗</div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.assignedOrders || 0 }}</div>
            <div class="stat-label">Assigned</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🏃</div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.inProgressOrders || 0 }}</div>
            <div class="stat-label">In Progress</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.completedOrders || 0 }}</div>
            <div class="stat-label">Completed</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📈</div>
          <div class="stat-content">
            <div class="stat-number">{{ Math.round(stats.completionRate || 0) }}%</div>
            <div class="stat-label">Success Rate</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Refresh Button -->
    <div class="refresh-section">
      <button @click="refreshData" :disabled="loading" class="refresh-btn">
        <span v-if="loading">🔄 Refreshing...</span>
        <span v-else>🔄 Refresh Data</span>
      </button>
      <p class="last-updated">Last updated: {{ lastUpdated }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useOrdersStore } from '../store/orders'
import type { Order } from '../types'

const ordersStore = useOrdersStore()

const loading = ref(false)
const trackingOrders = ref<Order[]>([])
const stats = ref({
  totalOrders: 0,
  pendingOrders: 0,
  assignedOrders: 0,
  inProgressOrders: 0,
  completedOrders: 0,
  completionRate: 0
})
const lastUpdated = ref('')
let refreshInterval: number | null = null

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString()
}

const getProgressWidth = (status: string) => {
  const progressMap: Record<string, string> = {
    'pending': '25%',
    'assigned': '50%',
    'in_progress': '75%',
    'completed': '100%',
    'cancelled': '0%'
  }
  return progressMap[status] || '0%'
}

const loadTrackingData = async () => {
  loading.value = true
  
  try {
    const [orders, orderStats] = await Promise.all([
      ordersStore.fetchTrackingOrders(),
      ordersStore.getOrderStats()
    ])
    
    trackingOrders.value = orders
    stats.value = orderStats
    lastUpdated.value = new Date().toLocaleString()
  } catch (error) {
    console.error('Failed to load tracking data:', error)
  } finally {
    loading.value = false
  }
}

const refreshData = async () => {
  await loadTrackingData()
}

const startAutoRefresh = () => {
  // Refresh every 30 seconds
  refreshInterval = setInterval(loadTrackingData, 30000)
}

const stopAutoRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
    refreshInterval = null
  }
}

onMounted(async () => {
  await loadTrackingData()
  startAutoRefresh()
})

onUnmounted(() => {
  stopAutoRefresh()
})
</script>

<style scoped>
.tracking-page {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-header h1 {
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: #666;
  font-size: 1.1rem;
}

.tracking-section {
  margin-bottom: 3rem;
}

.tracking-section h2 {
  color: #333;
  margin-bottom: 2rem;
  font-size: 1.5rem;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.no-orders {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.no-orders-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.no-orders h3 {
  margin-bottom: 0.5rem;
  color: #333;
}

.orders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;
}

.order-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0,0,0,0.15);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.order-id {
  font-weight: bold;
  color: #333;
  font-size: 1.1rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-pending { background: #fff3cd; color: #856404; }
.status-assigned { background: #d1ecf1; color: #0c5460; }
.status-in_progress { background: #d4edda; color: #155724; }
.status-completed { background: #cce5ff; color: #004085; }

.customer-info {
  margin-bottom: 1.5rem;
}

.customer-info h3 {
  margin: 0 0 0.25rem 0;
  color: #333;
  font-size: 1.1rem;
}

.customer-info p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.route-info {
  margin-bottom: 1.5rem;
}

.route-point {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.route-point:last-child {
  margin-bottom: 0;
}

.point-icon {
  font-size: 1.2rem;
  margin-right: 0.75rem;
  margin-top: 0.1rem;
}

.point-details {
  flex: 1;
}

.point-label {
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.point-address {
  color: #666;
  font-size: 0.85rem;
  line-height: 1.4;
}

.route-line {
  width: 2px;
  height: 20px;
  background: #ddd;
  margin-left: 0.6rem;
  margin-bottom: 0.5rem;
}

.driver-info {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
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
  font-weight: bold;
  margin-right: 1rem;
}

.driver-details {
  flex: 1;
}

.driver-name {
  font-weight: 500;
  color: #333;
  margin-bottom: 0.25rem;
}

.driver-vehicle {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.driver-phone {
  color: #666;
  font-size: 0.8rem;
}

.order-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.meta-label {
  color: #666;
}

.meta-value {
  color: #333;
  font-weight: 500;
}

.order-progress {
  margin-top: 1rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-pending { background: #ffc107; }
.progress-assigned { background: #17a2b8; }
.progress-in_progress { background: #28a745; }
.progress-completed { background: #007bff; }

.progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #666;
}

.progress-labels span {
  transition: color 0.3s ease;
}

.progress-labels span.active {
  color: #333;
  font-weight: 500;
}

.stats-section {
  margin-bottom: 3rem;
}

.stats-section h2 {
  color: #333;
  margin-bottom: 2rem;
  font-size: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
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
  color: #667eea;
  margin-bottom: 0.25rem;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

.refresh-section {
  text-align: center;
  padding: 2rem;
}

.refresh-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s;
}

.refresh-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.refresh-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.last-updated {
  margin-top: 1rem;
  color: #666;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }
  
  .orders-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .order-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .driver-info {
    flex-direction: column;
    text-align: center;
  }
  
  .driver-avatar {
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
}
</style>
