import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import MealLogger from './components/MealLogger'
import MealTracker from './components/MealTracker'
import Recommendations from './components/Recommendations'
import Login from './components/Login'
import Register from './components/Register'
import './App.css'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading-screen">Loading...</div>
  return user ? children : <Navigate to="/login" />
}

const AppContent = () => {
  const { user } = useAuth()

  return (
    <div className="app">
      {user && <Navbar />}
      <main className="main-content">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/log-meal" element={<ProtectedRoute><MealLogger /></ProtectedRoute>} />
          <Route path="/track" element={<ProtectedRoute><MealTracker /></ProtectedRoute>} />
          <Route path="/recommendations" element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  )
}

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
)

export default App
