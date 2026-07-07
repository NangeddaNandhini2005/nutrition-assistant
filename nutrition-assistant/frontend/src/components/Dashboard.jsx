import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import './Dashboard.css'

const Dashboard = () => {
  const { user } = useAuth()
  const [summary, setSummary] = useState(null)
  const [weeklyData, setWeeklyData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        const headers = { Authorization: `Bearer ${token}` }
        const [todayRes, weeklyRes] = await Promise.all([
          axios.get('/api/meals/today', { headers }),
          axios.get('/api/nutrition/weekly-summary', { headers })
        ])
        setSummary(todayRes.data)
        setWeeklyData(weeklyRes.data)
      } catch (err) {
        setError('Failed to load data')
      }
    }
    fetchData()
  }, [])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  const getMealCountByType = (type) => {
    if (!summary?.meals) return 0
    return summary.meals.filter(m => m.mealType === type).length
  }

  if (!summary) {
    return <div className="loading">Loading your nutrition dashboard...</div>
  }

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <div>
          <h1>{getGreeting()}, {user?.name}!</h1>
          <p className="welcome-subtitle">Here's your nutrition overview for today</p>
        </div>
        <Link to="/log-meal" className="btn btn-primary">+ Log a Meal</Link>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card calories">
          <div className="stat-icon">🔥</div>
          <div className="stat-info">
            <span className="stat-value">{summary.totalCalories}</span>
            <span className="stat-label">Calories</span>
          </div>
        </div>
        <div className="stat-card protein">
          <div className="stat-icon">🥩</div>
          <div className="stat-info">
            <span className="stat-value">{summary.totalProtein}g</span>
            <span className="stat-label">Protein</span>
          </div>
        </div>
        <div className="stat-card carbs">
          <div className="stat-icon">🍚</div>
          <div className="stat-info">
            <span className="stat-value">{summary.totalCarbs}g</span>
            <span className="stat-label">Carbs</span>
          </div>
        </div>
        <div className="stat-card fat">
          <div className="stat-icon">🧈</div>
          <div className="stat-info">
            <span className="stat-value">{summary.totalFat}g</span>
            <span className="stat-label">Fat</span>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">Today's Meals</div>
          {summary.meals && summary.meals.length > 0 ? (
            <div className="meal-list">
              {['breakfast', 'lunch', 'dinner', 'snack'].map(type => {
                const meals = summary.meals.filter(m => m.mealType === type)
                if (meals.length === 0) return null
                return (
                  <div key={type} className="meal-type-group">
                    <h4 className="meal-type-label">{type.charAt(0).toUpperCase() + type.slice(1)}</h4>
                    {meals.map(meal => (
                      <div key={meal._id} className="meal-item">
                        <div className="meal-item-header">
                          <span className="meal-item-name">{meal.items.map(i => i.foodName).join(', ')}</span>
                          <span className="meal-item-cal">{meal.totalCalories} cal</span>
                        </div>
                        <div className="meal-item-macros">
                          <span>P: {meal.totalProtein}g</span>
                          <span>C: {meal.totalCarbs}g</span>
                          <span>F: {meal.totalFat}g</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="empty-state">
              <p>No meals logged today</p>
              <Link to="/log-meal" className="btn btn-secondary">Log Your First Meal</Link>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">Quick Actions</div>
          <div className="quick-actions">
            <Link to="/log-meal" className="action-card">
              <span className="action-icon">📝</span>
              <span>Log Meal</span>
            </Link>
            <Link to="/track" className="action-card">
              <span className="action-icon">📊</span>
              <span>View Tracker</span>
            </Link>
            <Link to="/recommendations" className="action-card">
              <span className="action-icon">💡</span>
              <span>Recommendations</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
