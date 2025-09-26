// Simple authentication setup for testing
// This will be called when the app starts to set up authentication

export const setupTestAuth = () => {
  // Set a mock token for testing
  localStorage.setItem('access_token', 'mock-token-for-testing')
  console.log('✅ Test authentication token set')
}

// Call this when the app starts
setupTestAuth()
