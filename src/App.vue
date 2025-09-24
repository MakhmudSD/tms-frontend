<template>
  <div id="app">
    <nav class="navbar" v-if="isAuthenticated">
      <div class="nav-brand">
        <h1>🚛 광양 스마트 물류 플랫폼</h1>
        <p class="nav-subtitle">Gwangyang Smart Logistics Platform</p>
      </div>
      <div class="nav-menu">
        <router-link to="/orders" class="nav-link">
          <i class="nav-icon">📋</i>
          주문 관리
        </router-link>
        <router-link to="/drivers" class="nav-link">
          <i class="nav-icon">🚛</i>
          배차 관리
        </router-link>
        <router-link to="/tracking" class="nav-link">
          <i class="nav-icon">📍</i>
          운송 현황
        </router-link>
        <router-link to="/emergency" class="nav-link">
          <i class="nav-icon">🚨</i>
          비상 상황
        </router-link>
        <button @click="logout" class="nav-link logout-btn">
          <i class="nav-icon">🚪</i>
          로그아웃
        </button>
      </div>
    </nav>
    
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from './store/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const isAuthenticated = computed(() => authStore.isAuthenticated)

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background-color: #f5f5f5;
}

#app {
  min-height: 100vh;
}

.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.nav-brand h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.nav-subtitle {
  font-size: 0.8rem;
  opacity: 0.8;
  margin: 0;
}

.nav-menu {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.nav-icon {
  font-size: 1rem;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
}

.logout-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: inherit;
}

.main-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-menu {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .main-content {
    padding: 1rem;
  }
}
</style>
