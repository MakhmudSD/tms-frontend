<template>
  <div class="orders-page">
    <div class="page-header">
      <h1>📋 Orders Management</h1>
      <button @click="showCreateModal = true" class="btn btn-primary">
        ➕ New Order
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-number">{{ stats.totalOrders || 0 }}</div>
        <div class="stat-label">Total Orders</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ stats.pendingOrders || 0 }}</div>
        <div class="stat-label">Pending</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ stats.completedOrders || 0 }}</div>
        <div class="stat-label">Completed</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ Math.round(stats.completionRate || 0) }}%</div>
        <div class="stat-label">Completion Rate</div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters">
      <select v-model="statusFilter" @change="filterOrders" class="filter-select">
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="assigned">Assigned</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>

    <!-- Orders Table -->
    <div class="orders-table-container">
      <table class="orders-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Pickup</th>
            <th>Dropoff</th>
            <th>Status</th>
            <th>Driver</th>
            <th>Priority</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>
              <div class="customer-info">
                <div class="customer-name">{{ order.customerName }}</div>
                <div class="customer-phone">{{ order.customerPhone }}</div>
              </div>
            </td>
            <td class="location">{{ order.pickupLocation }}</td>
            <td class="location">{{ order.dropoffLocation }}</td>
            <td>
              <span :class="['status-badge', `status-${order.status}`]">
                {{ order.status }}
              </span>
            </td>
            <td>
              <span v-if="order.driver">{{ order.driver.name }}</span>
              <span v-else class="no-driver">No driver</span>
            </td>
            <td>
              <span :class="['priority-badge', `priority-${order.priority}`]">
                {{ order.priority }}
              </span>
            </td>
            <td class="actions">
              <button @click="viewOrder(order)" class="btn btn-sm">👁️</button>
              <button @click="editOrder(order)" class="btn btn-sm">✏️</button>
              <button 
                v-if="!order.driverId && order.status === 'pending'" 
                @click="assignDriver(order)" 
                class="btn btn-sm btn-success"
              >
                🚗 Assign
              </button>
              <button @click="deleteOrder(order)" class="btn btn-sm btn-danger">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create/Edit Order Modal -->
    <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>{{ showCreateModal ? 'Create New Order' : 'Edit Order' }}</h2>
          <button @click="closeModal" class="close-btn">✕</button>
        </div>
        
        <form @submit.prevent="handleSubmit" class="modal-form">
          <div class="form-row">
            <div class="form-group">
              <label>Customer Name *</label>
              <input v-model="orderForm.customerName" type="text" required />
            </div>
            <div class="form-group">
              <label>Customer Phone *</label>
              <input v-model="orderForm.customerPhone" type="tel" required />
            </div>
          </div>
          
          <div class="form-group">
            <label>Pickup Location *</label>
            <input v-model="orderForm.pickupLocation" type="text" required />
          </div>
          
          <div class="form-group">
            <label>Dropoff Location *</label>
            <input v-model="orderForm.dropoffLocation" type="text" required />
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Priority</label>
              <select v-model="orderForm.priority">
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div class="form-group">
              <label>Estimated Fare</label>
              <input v-model.number="orderForm.estimatedFare" type="number" step="0.01" />
            </div>
          </div>
          
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="orderForm.description" rows="3"></textarea>
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn btn-secondary">Cancel</button>
            <button type="submit" :disabled="loading" class="btn btn-primary">
              {{ loading ? 'Saving...' : (showCreateModal ? 'Create Order' : 'Update Order') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Assign Driver Modal -->
    <div v-if="showAssignModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>Assign Driver to Order #{{ selectedOrder?.id }}</h2>
          <button @click="closeModal" class="close-btn">✕</button>
        </div>
        
        <div class="available-drivers">
          <h3>Available Drivers</h3>
          <div v-if="availableDrivers.length === 0" class="no-drivers">
            No available drivers found
          </div>
          <div v-else class="drivers-list">
            <div 
              v-for="driver in availableDrivers" 
              :key="driver.id"
              @click="assignDriverToOrder(driver)"
              class="driver-item"
            >
              <div class="driver-info">
                <div class="driver-name">{{ driver.name }}</div>
                <div class="driver-details">{{ driver.vehicle }} • {{ driver.phone }}</div>
              </div>
              <button class="btn btn-sm btn-primary">Assign</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useOrdersStore } from '../store/orders'
import { useDriversStore } from '../store/drivers'
import type { Order, CreateOrderRequest, UpdateOrderRequest } from '../types'

const ordersStore = useOrdersStore()
const driversStore = useDriversStore()

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showAssignModal = ref(false)
const selectedOrder = ref<Order | null>(null)
const statusFilter = ref('')
const loading = ref(false)

const orderForm = reactive<CreateOrderRequest & { id?: number }>({
  customerName: '',
  customerPhone: '',
  pickupLocation: '',
  dropoffLocation: '',
  priority: 'normal',
  description: '',
  estimatedFare: undefined
})

const stats = ref({
  totalOrders: 0,
  pendingOrders: 0,
  completedOrders: 0,
  completionRate: 0
})

const filteredOrders = computed(() => {
  if (!statusFilter.value) return ordersStore.orders
  return ordersStore.orders.filter(order => order.status === statusFilter.value)
})

const availableDrivers = computed(() => driversStore.availableDrivers)

onMounted(async () => {
  await Promise.all([
    ordersStore.fetchOrders(),
    driversStore.fetchAvailableDrivers(),
    loadStats()
  ])
})

const loadStats = async () => {
  try {
    stats.value = await ordersStore.getOrderStats()
  } catch (error) {
    console.error('Failed to load stats:', error)
  }
}

const filterOrders = () => {
  // Filtering is handled by computed property
}

const viewOrder = (order: Order) => {
  selectedOrder.value = order
  // Could open a detailed view modal
  console.log('View order:', order)
}

const editOrder = (order: Order) => {
  selectedOrder.value = order
  Object.assign(orderForm, {
    ...order,
    id: order.id
  })
  showEditModal.value = true
}

const assignDriver = (order: Order) => {
  selectedOrder.value = order
  showAssignModal.value = true
}

const assignDriverToOrder = async (driver: any) => {
  if (!selectedOrder.value) return
  
  try {
    await ordersStore.assignDriver(selectedOrder.value.id, { driverId: driver.id })
    await driversStore.fetchAvailableDrivers() // Refresh available drivers
    closeModal()
  } catch (error) {
    console.error('Failed to assign driver:', error)
  }
}

const deleteOrder = async (order: Order) => {
  if (confirm(`Are you sure you want to delete order #${order.id}?`)) {
    try {
      await ordersStore.deleteOrder(order.id)
    } catch (error) {
      console.error('Failed to delete order:', error)
    }
  }
}

const handleSubmit = async () => {
  loading.value = true
  
  try {
    if (showCreateModal.value) {
      await ordersStore.createOrder(orderForm)
    } else if (showEditModal.value && orderForm.id) {
      await ordersStore.updateOrder(orderForm.id, orderForm)
    }
    
    closeModal()
    await loadStats()
  } catch (error) {
    console.error('Failed to save order:', error)
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  showAssignModal.value = false
  selectedOrder.value = null
  
  // Reset form
  Object.assign(orderForm, {
    customerName: '',
    customerPhone: '',
    pickupLocation: '',
    dropoffLocation: '',
    priority: 'normal',
    description: '',
    estimatedFare: undefined,
    id: undefined
  })
}
</script>

<style scoped>
.orders-page {
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
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: #667eea;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

.filters {
  margin-bottom: 1rem;
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
}

.orders-table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
}

.orders-table th,
.orders-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.orders-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.customer-info {
  display: flex;
  flex-direction: column;
}

.customer-name {
  font-weight: 500;
}

.customer-phone {
  font-size: 0.8rem;
  color: #666;
}

.location {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-pending { background: #fff3cd; color: #856404; }
.status-assigned { background: #d1ecf1; color: #0c5460; }
.status-in_progress { background: #d4edda; color: #155724; }
.status-completed { background: #cce5ff; color: #004085; }
.status-cancelled { background: #f8d7da; color: #721c24; }

.priority-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: capitalize;
}

.priority-low { background: #e9ecef; color: #495057; }
.priority-normal { background: #d1ecf1; color: #0c5460; }
.priority-high { background: #fff3cd; color: #856404; }
.priority-urgent { background: #f8d7da; color: #721c24; }

.no-driver {
  color: #999;
  font-style: italic;
}

.actions {
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
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  border-color: #667eea;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.available-drivers {
  padding: 1.5rem;
}

.available-drivers h3 {
  margin-bottom: 1rem;
  color: #333;
}

.no-drivers {
  text-align: center;
  color: #666;
  padding: 2rem;
}

.drivers-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.driver-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.driver-item:hover {
  background: #f8f9fa;
}

.driver-info {
  flex: 1;
}

.driver-name {
  font-weight: 500;
  color: #333;
}

.driver-details {
  font-size: 0.9rem;
  color: #666;
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
  
  .orders-table {
    font-size: 0.8rem;
  }
  
  .orders-table th,
  .orders-table td {
    padding: 0.5rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .modal {
    width: 95%;
  }
}
</style>
