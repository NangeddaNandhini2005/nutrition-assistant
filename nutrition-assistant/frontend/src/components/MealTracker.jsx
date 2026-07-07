import { useState, useEffect } from 'react'
import axios from 'axios'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts'
import './MealTracker.css'

const MealTracker = () => {
  const [weeklyData, setWeeklyData] = useState(null)
  const [dailyDetail, setDailyDetail] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        const headers = { Authorization: `Bearer ${token}` }
        const [weeklyRes, dailyRes] = await Promise.all([
          axios.get('/api/nutrition/weekly-summary', { headers }),
          axios.get(`/api/nutrition/daily-summary?date=${selectedDate}`, { headers })
        ])
        setWeeklyData(weeklyRes.data)
        setDailyDetail(dailyRes.data)
      } catch (err) {
        console.error('Failed to load tracker data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [selectedDate])

  if (loading) return <div className="loading">Loading tracker...</div>

  const chartData = weeklyData ? Object.entries(weeklyData.dailyTotals).map(([date, vals]) => ({
    date: new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    ...vals
  })) : []

  const getDaySummary = (dateStr) => {
    if (!weeklyData?.dailyTotals) return null
    return weeklyData.dailyTotals[dateStr]
  }

  return (
    <div className="meal-tracker">
      <h1>Nutrition Tracker</h1>
      <p className="page-subtitle">Track your daily nutrition and weekly trends</p>

      <div className="card">
        <div className="card-header">Daily Nutrition View</div>
        <div className="form-group">
          <label>Select Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-picker"
          />
        </div>

        {dailyDetail && (
          <div className="daily-detail">
            <div className="stats-grid mini-stats">
              <div className="stat-card calories">
                <div className="stat-info">
                  <span className="stat-value">{dailyDetail.totalCalories}</span>
                  <span className="stat-label">Calories</span>
                </div>
              </div>
              <div className="stat-card protein">
                <div className="stat-info">
                  <span className="stat-value">{dailyDetail.totalProtein}g</span>
                  <span className="stat-label">Protein</span>
                </div>
              </div>
              <div className="stat-card carbs">
                <div className="stat-info">
                  <span className="stat-value">{dailyDetail.totalCarbs}g</span>
                  <span className="stat-label">Carbs</span>
                </div>
              </div>
              <div className="stat-card fat">
                <div className="stat-info">
                  <span className="stat-value">{dailyDetail.totalFat}g</span>
                  <span className="stat-label">Fat</span>
                </div>
              </div>
            </div>
            <p className="meal-count">{dailyDetail.mealCount} meal(s) logged</p>
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-header">Weekly Trends (Last 7 Days)</div>
        {chartData.length > 0 ? (
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="calories" fill="#4CAF50" name="Calories" radius={[4, 4, 0, 0]} />
                <Bar dataKey="protein" fill="#2196F3" name="Protein (g)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="carbs" fill="#FF9800" name="Carbs (g)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="fat" fill="#f44336" name="Fat (g)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="empty-state">
            <p>No data available for last 7 days</p>
            <p className="empty-hint">Start logging meals to see your trends</p>
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-header">Daily Breakdown</div>
        {dailyDetail?.meals && dailyDetail.meals.length > 0 ? (
          <div className="daily-meals">
            {dailyDetail.meals.map(meal => (
              <div key={meal._id} className="tracker-meal-item">
                <div className="tracker-meal-header">
                  <span className="tracker-meal-type">{meal.mealType}</span>
                  <span className="tracker-meal-cal">{meal.totalCalories} cal</span>
                </div>
                <div className="tracker-meal-foods">
                  {meal.items.map((item, idx) => (
                    <span key={idx} className="tracker-food-item">
                      {item.foodName} ({item.quantity}{item.unit})
                    </span>
                  ))}
                </div>
                <div className="tracker-meal-macros">
                  P: {meal.totalProtein}g &middot; C: {meal.totalCarbs}g &middot; F: {meal.totalFat}g
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No meals logged for this date</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MealTracker
