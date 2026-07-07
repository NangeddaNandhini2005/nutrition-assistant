import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './MealLogger.css'

const commonFoods = [
  { name: 'Rice (cooked)', category: 'Grains', calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  { name: 'Chicken Breast', category: 'Meat', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: 'Egg (whole)', category: 'Dairy', calories: 155, protein: 13, carbs: 1.1, fat: 11 },
  { name: 'Banana', category: 'Fruits', calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
  { name: 'Apple', category: 'Fruits', calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
  { name: 'Bread (whole wheat)', category: 'Grains', calories: 247, protein: 13, carbs: 41, fat: 3.4 },
  { name: 'Milk (whole)', category: 'Dairy', calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3 },
  { name: 'Broccoli', category: 'Vegetables', calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
  { name: 'Salmon', category: 'Meat', calories: 208, protein: 20, carbs: 0, fat: 13 },
  { name: 'Sweet Potato', category: 'Vegetables', calories: 86, protein: 1.6, carbs: 20, fat: 0.1 },
  { name: 'Oats', category: 'Grains', calories: 389, protein: 16.9, carbs: 66, fat: 6.9 },
  { name: 'Greek Yogurt', category: 'Dairy', calories: 59, protein: 10, carbs: 3.6, fat: 0.7 },
  { name: 'Almonds', category: 'Nuts', calories: 579, protein: 21, carbs: 22, fat: 50 },
  { name: 'Avocado', category: 'Fruits', calories: 160, protein: 2, carbs: 8.5, fat: 14.7 },
  { name: 'Tuna (canned)', category: 'Meat', calories: 132, protein: 28, carbs: 0, fat: 1.5 }
]

const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack']

const MealLogger = () => {
  const navigate = useNavigate()
  const [mealType, setMealType] = useState('breakfast')
  const [items, setItems] = useState([{ foodName: '', quantity: 100, unit: 'g', calories: 0, protein: 0, carbs: 0, fat: 0 }])
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredFoods = commonFoods.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const addItem = () => {
    setItems([...items, { foodName: '', quantity: 100, unit: 'g', calories: 0, protein: 0, carbs: 0, fat: 0 }])
  }

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const updateItem = (index, field, value) => {
    const newItems = [...items]
    newItems[index][field] = value

    if (field === 'foodName') {
      const food = commonFoods.find(f => f.name === value)
      if (food) {
        newItems[index].calories = Math.round(food.calories * newItems[index].quantity / 100)
        newItems[index].protein = Math.round(food.protein * newItems[index].quantity / 100 * 10) / 10
        newItems[index].carbs = Math.round(food.carbs * newItems[index].quantity / 100 * 10) / 10
        newItems[index].fat = Math.round(food.fat * newItems[index].quantity / 100 * 10) / 10
      }
    }

    if (field === 'quantity') {
      const food = commonFoods.find(f => f.name === newItems[index].foodName)
      if (food) {
        newItems[index].calories = Math.round(food.calories * value / 100)
        newItems[index].protein = Math.round(food.protein * value / 100 * 10) / 10
        newItems[index].carbs = Math.round(food.carbs * value / 100 * 10) / 10
        newItems[index].fat = Math.round(food.fat * value / 100 * 10) / 10
      }
    }

    setItems(newItems)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const validItems = items.filter(i => i.foodName && i.quantity > 0)
    if (validItems.length === 0) {
      setError('Please add at least one food item')
      return
    }

    try {
      const token = localStorage.getItem('token')
      await axios.post('/api/meals', {
        mealType,
        items: validItems,
        notes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSuccess('Meal logged successfully!')
      setItems([{ foodName: '', quantity: 100, unit: 'g', calories: 0, protein: 0, carbs: 0, fat: 0 }])
      setNotes('')
      setTimeout(() => navigate('/'), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log meal')
    }
  }

  return (
    <div className="meal-logger">
      <h1>Log a Meal</h1>
      <p className="page-subtitle">Record what you've eaten to track your nutrition</p>

      <form onSubmit={handleSubmit} className="meal-form">
        <div className="card">
          <div className="card-header">Meal Details</div>

          <div className="form-group">
            <label>Meal Type</label>
            <div className="meal-type-selector">
              {mealTypes.map(type => (
                <button
                  key={type}
                  type="button"
                  className={`meal-type-btn ${mealType === type ? 'active' : ''}`}
                  onClick={() => setMealType(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Search Foods</label>
            <input
              type="text"
              placeholder="Search for a food..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <div className="food-search-results">
                {filteredFoods.map(food => (
                  <div
                    key={food.name}
                    className="food-search-item"
                    onClick={() => {
                      updateItem(0, 'foodName', food.name)
                      setSearchTerm('')
                    }}
                  >
                    <span className="food-name">{food.name}</span>
                    <span className="food-cal">{food.calories} cal/100g</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            Food Items
            <button type="button" onClick={addItem} className="btn btn-secondary" style={{ marginLeft: 'auto', padding: '6px 14px', fontSize: '0.85rem' }}>
              + Add Item
            </button>
          </div>

          {items.map((item, index) => (
            <div key={index} className="food-item-row">
              <div className="food-item-row-header">
                <span className="item-number">Item {index + 1}</span>
                {items.length > 1 && (
                  <button type="button" onClick={() => removeItem(index)} className="btn-danger-sm">Remove</button>
                )}
              </div>
              <div className="food-item-fields">
                <div className="form-group">
                  <label>Food</label>
                  <input
                    type="text"
                    value={item.foodName}
                    onChange={(e) => updateItem(index, 'foodName', e.target.value)}
                    placeholder="e.g. Chicken Breast"
                    list={`food-suggestions-${index}`}
                  />
                  <datalist id={`food-suggestions-${index}`}>
                    {commonFoods.map(f => <option key={f.name} value={f.name} />)}
                  </datalist>
                </div>
                <div className="form-group">
                  <label>Quantity (g)</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                    min="1"
                    step="10"
                  />
                </div>
                <div className="form-group">
                  <label>Calories</label>
                  <input type="number" value={item.calories} readOnly className="readonly" />
                </div>
              </div>
              <div className="food-item-macros-preview">
                <span className="macro-badge protein">P: {item.protein}g</span>
                <span className="macro-badge carbs">C: {item.carbs}g</span>
                <span className="macro-badge fat">F: {item.fat}g</span>
              </div>
            </div>
          ))}

          {items.length > 0 && (
            <div className="food-item-total">
              <strong>Totals:</strong> {items.reduce((s, i) => s + Number(i.calories), 0)} cal |
              P: {items.reduce((s, i) => s + Number(i.protein), 0)}g |
              C: {items.reduce((s, i) => s + Number(i.carbs), 0)}g |
              F: {items.reduce((s, i) => s + Number(i.fat), 0)}g
            </div>
          )}
        </div>

        <div className="card">
          <div className="form-group">
            <label>Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes about this meal..."
              rows="2"
            />
          </div>
        </div>

        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}

        <button type="submit" className="btn btn-primary submit-btn">Save Meal</button>
      </form>
    </div>
  )
}

export default MealLogger
