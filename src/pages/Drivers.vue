<template>
  <div class="drivers-page">
    <div class="page-header">
      <h1>🚗 Drivers Management</h1>
      <button @click="showCreateModal = true" class="btn btn-primary">
        ➕ New Driver
      </button>
    </div>

    <!-- Drivers Grid -->
    <div class="drivers-grid">
      <div v-for="driver in drivers" :key="driver.id" class="driver-card">
        <div class="driver-header">
          <div class="driver-avatar">
            {{ driver.name.charAt(0).toUpperCase() }}
          </div>
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
          <div class="detail-item" v-if="driver.licenseNumber">
            <span class="label">License:</span>
            <span class="value">{{ driver.licenseNumber }}</span>
          </div>
          <div class="detail-item" v-if="driver.email">
            <span class="label">Email:</span>
            <span class="value">{{ driver.email }}</span>
          </div>
          <div class="detail-item" v-if="driver.address">
            <span class="label">Address:</span>
            <span class="value">{{ driver.address }}</span>
          </div>
        </div>
        
        <div class="driver-stats" v-if="driverStats[driver.id]">
          <div class="stat">
            <span class="stat-number">{{ driverStats[driver.id].totalOrders }}</span>
            <span class="stat-label">Total Orders</span>
          </div>
          <div class="stat">
            <span class="stat-number">{{ driverStats[driver.id].completedOrders }}</span>
            <span class="stat-label">Completed</span>
          </div>
          <div class="stat">
            <span class="stat-number">{{ Math.round(driverStats[driver.id].completionRate) }}%</span>
            <span class="stat-label">Success Rate</span>
          </div>
        </div>
        
        <div class="driver-actions">
          <button @click="viewDriver(driver)" class="btn btn-sm">👁️ View</button>
          <button @click="editDriver(driver)" class="btn btn-sm">✏️ Edit</button>
          <button 
            @click="updateDriverStatus(driver)" 
            :class="['btn', 'btn-sm', driver.status === 'available' ? 'btn-warning' : 'btn-success']"
          >
            {{ driver.status === 'available' ? '🚫 Set Busy' : '✅ Set Available' }}
          </button>
          <button @click="deleteDriver(driver)" class="btn btn-sm btn-danger">🗑️ Delete</button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Driver Modal -->
    <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>{{ showCreateModal ? 'Create New Driver' : 'Edit Driver' }}</h2>
          <button @click="closeModal" class="close-btn">✕</button>
        </div>
        
        <form @submit.prevent="handleSubmit" class="modal-form">
          <div class="form-row">
            <div class="form-group">
              <label>Full Name *</label>
              <input v-model="driverForm.name" type="text" required />
            </div>
            <div class="form-group">
              <label>Phone Number *</label>
              <input v-model="driverForm.phone" type="tel" required />
            </div>
          </div>
          
          <div class="form-group">
            <label>Vehicle Information *</label>
            <input v-model="driverForm.vehicle" type="text" required placeholder="e.g., Toyota Camry - ABC123" />
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>License Number</label>
              <input v-model="driverForm.licenseNumber" type="text" />
            </div>
            <div class="form-group">
              <label>Status</label>
              <select v-model="driverForm.status">
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label>Email</label>
            <input v-model="driverForm.email" type="email" />
          </div>
          
          <div class="form-group">
            <label>Address</label>
            <textarea v-model="driverForm.address" rows="2"></textarea>
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn btn-secondary">Cancel</button>
            <button type="submit" :disabled="loading" class="btn btn-primary">
              {{ loading ? 'Saving...' : (showCreateModal ? 'Create Driver' : 'Update Driver') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Driver Details Modal -->
    <div v-if="showDetailsModal && selectedDriver" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>Driver Details - {{ selectedDriver.name }}</h2>
          <button @click="closeModal" class="close-btn">✕</button>
        </div>
        
        <div class="driver-details-modal">
          <div class="detail-section">
            <h3>Personal Information</h3>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="label">Name:</span>
                <span class="value">{{ selectedDriver.name }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Phone:</span>
                <span class="value">{{ selectedDriver.phone }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Email:</span>
                <span class="value">{{ selectedDriver.email || 'Not provided' }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Address:</span>
                <span class="value">{{ selectedDriver.address || 'Not provided' }}</span>
              </div>
            </div>
          </div>
          
          <div class="detail-section">
            <h3>Vehicle Information</h3>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="label">Vehicle:</span>
                <span class="value">{{ selectedDriver.vehicle }}</span>
              </div>
              <div class="detail-item">
                <span class="label">License Number:</span>
                <span class="value">{{ selectedDriver.licenseNumber || 'Not provided' }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Status:</span>
                <span :class="['status-badge', `status-${selectedDriver.status}`]">
                  {{ selectedDriver.status }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="detail-section" v-if="driverStats[selectedDriver.id]">
            <h3>Performance Statistics</h3>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-number">{{ driverStats[selectedDriver.id].totalOrders }}</div>
                <div class="stat-label">Total Orders</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">{{ driverStats[selectedDriver.id].completedOrders }}</div>
                <div class="stat-label">Completed</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">{{ driverStats[selectedDriver.id].pendingOrders }}</div>
                <div class="stat-label">Pending</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">{{ Math.round(driverStats[selectedDriver.id].completionRate) }}%</div>
                <div class="stat-label">Success Rate</div>
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
import { useDriversStore } from '../store/drivers'
import type { Driver, CreateDriverRequest, UpdateDriverRequest } from '../types'

const driversStore = useDriversStore()

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDetailsModal = ref(false)
const selectedDriver = ref<Driver | null>(null)
const loading = ref(false)
const driverStats = ref<Record<number, any>>({})

const driverForm = reactive<CreateDriverRequest & { id?: number }>({
  name: '',
  phone: '',
  vehicle: '',
  licenseNumber: '',
  status: 'available',
  email: '',
  address: ''
})

const drivers = computed(() => driversStore.drivers)

onMounted(async () => {
  await driversStore.fetchDrivers()
  await loadDriverStats()
})

const loadDriverStats = async () => {
  for (const driver of drivers.value) {
    try {
      driverStats.value[driver.id] = await driversStore.getDriverStats(driver.id)
    } catch (error) {
      console.error(`Failed to load stats for driver ${driver.id}:`, error)
    }
  }
}

const viewDriver = async (driver: Driver) => {
  selectedDriver.value = driver
  showDetailsModal.value = true
  
  // Load stats if not already loaded
  if (!driverStats.value[driver.id]) {
    try {
      driverStats.value[driver.id] = await driversStore.getDriverStats(driver.id)
    } catch (error) {
      console.error('Failed to load driver stats:', error)
    }
  }
}

const editDriver = (driver: Driver) => {
  selectedDriver.value = driver
  Object.assign(driverForm, {
    ...driver,
    id: driver.id
  })
  showEditModal.value = true
}

const updateDriverStatus = async (driver: Driver) => {
  const newStatus = driver.status === 'available' ? 'busy' : 'available'
  
  try {
    await driversStore.updateDriverStatus(driver.id, newStatus)
    await loadDriverStats()
  } catch (error) {
    console.error('Failed to update driver status:', error)
  }
}

const deleteDriver = async (driver: Driver) => {
  if (confirm(`Are you sure you want to delete driver ${driver.name}?`)) {
    try {
      await driversStore.deleteDriver(driver.id)
      delete driverStats.value[driver.id]
    } catch (error) {
      console.error('Failed to delete driver:', error)
    }
  }
}

const handleSubmit = async () => {
  loading.value = true
  
  try {
    if (showCreateModal.value) {
      const newDriver = await driversStore.createDriver(driverForm)
      // Load stats for new driver
      driverStats.value[newDriver.id] = await driversStore.getDriverStats(newDriver.id)
    } else if (showEditModal.value && driverForm.id) {
      await driversStore.updateDriver(driverForm.id, driverForm)
    }
    
    closeModal()
  } catch (error) {
    console.error('Failed to save driver:', error)
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  showDetailsModal.value = false
  selectedDriver.value = null
  
  // Reset form
  Object.assign(driverForm, {
    name: '',
    phone: '',
    vehicle: '',
    licenseNumber: '',
    status: 'available',
    email: '',
    address: '',
    id: undefined
  })
}
</script>

<style scoped>
.drivers-page {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  color: #333;
  font-size: 2rem;
}

.drivers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.driver-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.driver-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0,0,0,0.15);
}

.driver-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.driver-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  margin-right: 1rem;
}

.driver-info {
  flex: 1;
}

.driver-info h3 {
  margin: 0 0 0.25rem 0;
  color: #333;
  font-size: 1.1rem;
}

.driver-phone {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.driver-status {
  margin-left: auto;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-available { background: #d4edda; color: #155724; }
.status-busy { background: #fff3cd; color: #856404; }
.status-offline { background: #f8d7da; color: #721c24; }

.driver-details {
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.detail-item .label {
  color: #666;
  font-weight: 500;
}

.detail-item .value {
  color: #333;
  text-align: right;
  max-width: 60%;
  word-break: break-word;
}

.driver-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.2rem;
  font-weight: bold;
  color: #667eea;
}

.stat-label {
  font-size: 0.7rem;
  color: #666;
}

.driver-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-warning {
  background: #ffc107;
  color: #212529;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}

.btn:hover {
  opacity: 0.8;
  transform: translateY(-1px);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
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
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
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
  border-radius: 6px;
  font-size: 1rem;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.driver-details-modal {
  padding: 1.5rem;
}

.detail-section {
  margin-bottom: 2rem;
}

.detail-section h3 {
  margin-bottom: 1rem;
  color: #333;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 0.5rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .drivers-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .driver-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .driver-actions {
    justify-content: center;
  }
  
  .modal {
    width: 95%;
  }
}
</style>
