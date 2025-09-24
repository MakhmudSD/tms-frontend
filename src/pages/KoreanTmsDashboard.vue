<template>
  <div class="container mx-auto p-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">한국 TMS 대시보드</h1>
      <p class="text-gray-600">Korean Transport Management System Dashboard</p>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 text-blue-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">지점</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.branches }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 text-green-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">고객</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.clients }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100 text-purple-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1m-6-1V6a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">차량</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.assets }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">경유지</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.waypoints }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-red-100 text-red-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">정산</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.settlements }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Tables -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Branches -->
      <div class="bg-white rounded-lg shadow-md">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">지점 현황</h3>
        </div>
        <div class="p-6">
          <div v-if="loading" class="text-center py-4">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <div v-else class="space-y-4">
            <div v-for="branch in branches" :key="branch.branch_id" class="border rounded-lg p-4">
              <h4 class="font-medium text-gray-900">{{ branch.branch_name }}</h4>
              <p class="text-sm text-gray-600">{{ branch.address }}</p>
              <p class="text-sm text-gray-500">관리자: {{ branch.manager_name }}</p>
              <p class="text-sm text-gray-500">전화: {{ branch.phone_number }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Clients -->
      <div class="bg-white rounded-lg shadow-md">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">고객 현황</h3>
        </div>
        <div class="p-6">
          <div v-if="loading" class="text-center py-4">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <div v-else class="space-y-4">
            <div v-for="client in clients" :key="client.client_id" class="border rounded-lg p-4">
              <h4 class="font-medium text-gray-900">{{ client.client_name }}</h4>
              <p class="text-sm text-gray-600">{{ client.email }}</p>
              <p class="text-sm text-gray-500">전화: {{ client.phone_number }}</p>
              <p class="text-sm text-gray-500">주소: {{ client.address }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Assets -->
      <div class="bg-white rounded-lg shadow-md">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">차량 현황</h3>
        </div>
        <div class="p-6">
          <div v-if="loading" class="text-center py-4">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <div v-else class="space-y-4">
            <div v-for="asset in assets" :key="asset.asset_id" class="border rounded-lg p-4">
              <h4 class="font-medium text-gray-900">{{ asset.asset_name }}</h4>
              <p class="text-sm text-gray-600">차종: {{ asset.asset_type }}</p>
              <p class="text-sm text-gray-500">번호판: {{ asset.license_plate }}</p>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="asset.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                {{ asset.status === 'ACTIVE' ? '운영중' : '비활성' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Waypoints -->
      <div class="bg-white rounded-lg shadow-md">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">경유지 현황</h3>
        </div>
        <div class="p-6">
          <div v-if="loading" class="text-center py-4">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <div v-else class="space-y-4">
            <div v-for="waypoint in waypoints" :key="waypoint.waypoint_id" class="border rounded-lg p-4">
              <h4 class="font-medium text-gray-900">{{ waypoint.waypoint_name }}</h4>
              <p class="text-sm text-gray-600">{{ waypoint.address }}</p>
              <p class="text-sm text-gray-500">유형: {{ waypoint.type }}</p>
              <p class="text-sm text-gray-500">좌표: {{ waypoint.latitude }}, {{ waypoint.longitude }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Settlements -->
    <div class="mt-8 bg-white rounded-lg shadow-md">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">정산 현황</h3>
      </div>
      <div class="p-6">
        <div v-if="loading" class="text-center py-4">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">정산 ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">정산일</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">금액</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="settlement in settlements" :key="settlement.settlement_id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ settlement.settlement_id }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(settlement.settlement_date) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatCurrency(settlement.total_amount) }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="getStatusColor(settlement.status)">
                    {{ getStatusText(settlement.status) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../api'

const loading = ref(true)
const stats = ref({
  branches: 0,
  clients: 0,
  assets: 0,
  waypoints: 0,
  settlements: 0
})
const branches = ref([])
const clients = ref([])
const assets = ref([])
const waypoints = ref([])
const settlements = ref([])

onMounted(async () => {
  try {
    // Fetch all Korean TMS data
    const [statsData, branchesData, clientsData, assetsData, waypointsData, settlementsData] = await Promise.all([
      api.getKoreanTmsStats(),
      api.getKoreanBranches(),
      api.getKoreanClients(),
      api.getKoreanAssets(),
      api.getKoreanWaypoints(),
      api.getKoreanSettlements()
    ])

    stats.value = statsData
    branches.value = branchesData
    clients.value = clientsData
    assets.value = assetsData
    waypoints.value = waypointsData
    settlements.value = settlementsData

  } catch (error) {
    console.error('Error fetching Korean TMS data:', error)
  } finally {
    loading.value = false
  }
})

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('ko-KR')
}

const formatCurrency = (amount: number) => {
  if (!amount) return '-'
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  }).format(amount)
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'bg-green-100 text-green-800'
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return '완료'
    case 'PENDING':
      return '대기'
    case 'CANCELLED':
      return '취소'
    default:
      return status
  }
}
</script>
