<template>
  <div class="database-test-page">
    <div class="page-header">
      <h1>🗄️ Database Connection Test</h1>
      <p>Testing real data from PostgreSQL database</p>
    </div>

    <!-- Database Status -->
    <div class="status-section">
      <h2>📊 Database Status</h2>
      <div v-if="dbStatus" class="status-card">
        <div class="status-item">
          <span class="label">Connected:</span>
          <span :class="['status', dbStatus.connected ? 'success' : 'error']">
            {{ dbStatus.connected ? '✅ Yes' : '❌ No' }}
          </span>
        </div>
        <div class="status-item">
          <span class="label">Initialized:</span>
          <span :class="['status', dbStatus.initialized ? 'success' : 'error']">
            {{ dbStatus.initialized ? '✅ Yes' : '❌ No' }}
          </span>
        </div>
      </div>
      <div v-else class="loading">Loading database status...</div>
    </div>

    <!-- Database Statistics -->
    <div class="stats-section">
      <h2>📈 Database Statistics</h2>
      <div v-if="dbStats" class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">{{ dbStats.users }}</div>
          <div class="stat-label">Users</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ dbStats.drivers }}</div>
          <div class="stat-label">Drivers</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ dbStats.orders }}</div>
          <div class="stat-label">Orders</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ dbStats.roles }}</div>
          <div class="stat-label">Roles</div>
        </div>
      </div>
      <div v-else class="loading">Loading statistics...</div>
    </div>

    <!-- Real Data Samples -->
    <div class="data-section">
      <h2>👥 Real Users from Database</h2>
      <div v-if="users.length > 0" class="users-grid">
        <div v-for="user in users" :key="user.user_id" class="user-card">
          <div class="user-header">
            <div class="user-avatar">{{ user.user_name.charAt(0).toUpperCase() }}</div>
            <div class="user-info">
              <h3>{{ user.user_name }}</h3>
              <p class="user-login">{{ user.login_id }}</p>
            </div>
            <div class="user-status">
              <span :class="['status-badge', user.status_code.toLowerCase()]">
                {{ user.status_code }}
              </span>
            </div>
          </div>
          <div class="user-details">
            <div class="detail-item">
              <span class="label">Email:</span>
              <span class="value">{{ user.email }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Role:</span>
              <span class="value">{{ user.role?.role_name || 'No role' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Created:</span>
              <span class="value">{{ formatDate(user.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="loading">Loading users...</div>
    </div>

    <!-- Real Drivers -->
    <div class="data-section">
      <h2>🚗 Real Drivers from Database</h2>
      <div v-if="drivers.length > 0" class="drivers-grid">
        <div v-for="driver in drivers" :key="driver.id" class="driver-card">
          <div class="driver-header">
            <div class="driver-avatar">{{ driver.name.charAt(0).toUpperCase() }}</div>
            <div class="driver-info">
              <h3>{{ driver.name }}</h3>
              <p class="driver-phone">{{ driver.phone }}</p>
            </div>
            <div class="driver-status">
              <span :class="['status-badge', `status-${driver.status}`]">
                {{ driver.status }}
              </span>
            </div>
          </div>
          <div class="driver-details">
            <div class="detail-item">
              <span class="label">Vehicle:</span>
              <span class="value">{{ driver.vehicle }}</span>
            </div>
            <div class="detail-item">
              <span class="label">License:</span>
              <span class="value">{{ driver.licenseNumber }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Orders:</span>
              <span class="value">{{ driver.orders?.length || 0 }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="loading">Loading drivers...</div>
    </div>

    <!-- Real Orders -->
    <div class="data-section">
      <h2>📦 Real Orders from Database</h2>
      <div v-if="orders.length > 0" class="orders-grid">
        <div v-for="order in orders" :key="order.id" class="order-card">
          <div class="order-header">
            <div class="order-info">
              <h3>{{ order.customerName }}</h3>
              <p class="order-phone">{{ order.customerPhone }}</p>
            </div>
            <div class="order-status">
              <span :class="['status-badge', `status-${order.status}`]">
                {{ order.status }}
              </span>
            </div>
          </div>
          <div class="order-details">
            <div class="detail-item">
              <span class="label">From:</span>
              <span class="value">{{ order.pickupLocation }}</span>
            </div>
            <div class="detail-item">
              <span class="label">To:</span>
              <span class="value">{{ order.dropoffLocation }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Driver:</span>
              <span class="value">{{ order.driver?.name || 'Unassigned' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Fare:</span>
              <span class="value">${{ order.estimatedFare || 'TBD' }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="loading">Loading orders...</div>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="error-section">
      <h2>❌ Error</h2>
      <div class="error-message">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../api'

interface DatabaseStatus {
  connected: boolean;
  initialized: boolean;
}

const dbStatus = ref<DatabaseStatus | any>(null)
const dbStats = ref<any>(null)
const users = ref<any[]>([])
const drivers = ref<any[]>([])
const orders = ref<any[]>([])
const error = ref<string | null>(null)

const loadData = async () => {
  try {
    // Load database status
    dbStatus.value = await api.getDatabaseStatus()
    
    // Load database statistics
    dbStats.value = await api.getDatabaseStats()
    
    // Load real data
    users.value = await api.getUsers()
    drivers.value = await api.getDrivers()
    orders.value = await api.getOrders()
    
    error.value = null
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load data'
    console.error('Error loading data:', err)
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.database-test-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-header h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.status-section,
.stats-section,
.data-section {
  margin-bottom: 30px;
}

.status-section h2,
.stats-section h2,
.data-section h2 {
  color: #34495e;
  margin-bottom: 15px;
  border-bottom: 2px solid #3498db;
  padding-bottom: 5px;
}

.status-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.status-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.status-item:last-child {
  margin-bottom: 0;
}

.label {
  font-weight: 600;
  color: #495057;
}

.status.success {
  color: #28a745;
  font-weight: 600;
}

.status.error {
  color: #dc3545;
  font-weight: 600;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border: 1px solid #dee2e6;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #3498db;
  margin-bottom: 5px;
}

.stat-label {
  color: #6c757d;
  font-weight: 500;
}

.users-grid,
.drivers-grid,
.orders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.user-card,
.driver-card,
.order-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border: 1px solid #dee2e6;
}

.user-header,
.driver-header,
.order-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.user-avatar,
.driver-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #3498db;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  margin-right: 15px;
}

.user-info,
.driver-info,
.order-info {
  flex: 1;
}

.user-info h3,
.driver-info h3,
.order-info h3 {
  margin: 0 0 5px 0;
  color: #2c3e50;
}

.user-login,
.driver-phone,
.order-phone {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.user-status,
.driver-status,
.order-status {
  margin-left: auto;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.active,
.status-badge.available {
  background: #d4edda;
  color: #155724;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.status-badge.completed {
  background: #d1ecf1;
  color: #0c5460;
}

.status-badge.in_progress {
  background: #f8d7da;
  color: #721c24;
}

.user-details,
.driver-details,
.order-details {
  display: grid;
  gap: 8px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
}

.detail-item .label {
  font-weight: 600;
  color: #495057;
}

.detail-item .value {
  color: #6c757d;
}

.loading {
  text-align: center;
  color: #6c757d;
  font-style: italic;
}

.error-section {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
}

.error-section h2 {
  color: #721c24;
  margin-bottom: 10px;
  border-bottom: none;
}

.error-message {
  color: #721c24;
  font-weight: 500;
}
</style>
