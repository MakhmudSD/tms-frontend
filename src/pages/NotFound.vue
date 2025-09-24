<template>
  <div class="not-found">
    <div class="not-found-content">
      <div class="not-found-icon">🚫</div>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <router-link to="/orders" class="btn btn-primary">
        Go to Orders
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// Simple 404 page
</script>

<style scoped>
.not-found {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.not-found-content {
  text-align: center;
  padding: 2rem;
}

.not-found-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.not-found-content h1 {
  color: #333;
  margin-bottom: 1rem;
}

.not-found-content p {
  color: #666;
  margin-bottom: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  text-decoration: none;
  display: inline-block;
  transition: transform 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn:hover {
  transform: translateY(-2px);
}
</style>
