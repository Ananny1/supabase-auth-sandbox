import { AuthProvider } from '@/auth/AuthProvider'
import { useAuth } from '@/auth/useAuth'
import AuthPage from '@/auth/AuthPage'
import HomePage from '@/home/HomePage'

function AppRoutes() {
  const { session, loading } = useAuth()

  if (loading) return null

  return session ? <HomePage /> : <AuthPage />
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
