<template>
  <div id="app">
    <nav class="navbar" v-if="isAuthenticated">
      <div class="nav-brand">
        <h1>🚛 TMS</h1>
      </div>
      <div class="nav-menu">
        <router-link to="/orders" class="nav-link">Orders</router-link>
        <router-link to="/drivers" class="nav-link">Drivers</router-link>
        <router-link to="/tracking" class="nav-link">Tracking</router-link>
        <button @click="logout" class="nav-link logout-btn">Logout</button>
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
}

.nav-menu {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: background-color 0.2s;
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
