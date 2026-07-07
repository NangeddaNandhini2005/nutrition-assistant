import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import './Recommendations.css'

const mealIdeas = {
  breakfast: {
    highProtein: ['Egg white omelette with spinach', 'Greek yogurt parfait with berries', 'Protein smoothie with banana'],
    lowCarb: ['Scrambled eggs with avocado', 'Cheese and vegetable frittata', 'Smoked salmon with cream cheese'],
    balanced: ['Oatmeal with fruits and nuts', 'Whole grain toast with peanut butter', 'Smoothie bowl with granola'],
    vegan: ['Tofu scramble', 'Smoothie with plant protein', 'Chia pudding with coconut milk']
  },
  lunch: {
    highProtein: ['Grilled chicken salad', 'Tuna wrap with whole wheat', 'Lean beef stir-fry with vegetables'],
    lowCarb: ['Zucchini noodle pasta', 'Cauliflower rice bowl', 'Grilled fish with steamed broccoli'],
    balanced: ['Quinoa bowl with vegetables', 'Turkey sandwich on whole grain', 'Brown rice with chicken and veggies'],
    vegan: ['Lentil soup with salad', 'Chickpea curry', 'Veggie stir-fry with tofu']
  },
  dinner: {
    highProtein: ['Baked salmon with asparagus', 'Grilled chicken with sweet potato', 'Lean steak with green beans'],
    lowCarb: ['Stuffed bell peppers', 'Grilled fish with cauliflower mash', 'Chicken thigh with roasted vegetables'],
    balanced: ['Grilled fish with rice and veggies', 'Whole wheat pasta with lean meat sauce', 'Stir-fried tofu with vegetables'],
    vegan: ['Bean and vegetable chili', 'Stuffed portobello mushrooms', 'Vegan Buddha bowl']
  },
  snack: {
    highProtein: ['Protein bar', 'Cottage cheese with fruit', 'Hard-boiled eggs'],
    lowCarb: ['Celery with almond butter', 'Cheese cubes', 'Mixed nuts'],
    balanced: ['Apple with peanut butter', 'Trail mix', 'Fruit and yogurt'],
    vegan: ['Hummus with vegetables', 'Edamame', 'Fruit smoothie']
  }
}

const dietTips = [
  { icon: '💧', title: 'Stay Hydrated', desc: 'Drink at least 8 glasses of water daily. Proper hydration aids digestion and nutrient absorption.' },
  { icon: '🥦', title: 'Eat the Rainbow', desc: 'Include a variety of colorful fruits and vegetables to ensure a wide range of nutrients.' },
  { icon: '⏰', title: 'Regular Meals', desc: 'Don\'t skip meals. Eating at regular intervals helps maintain stable blood sugar levels.' },
  { icon: '🧂', title: 'Watch Sodium', desc: 'Limit processed foods and added salt. Aim for less than 2300mg of sodium per day.' },
  { icon: '🌙', title: 'Mindful Eating', desc: 'Eat without distractions, chew slowly, and listen to your body\'s hunger cues.' },
  { icon: '💪', title: 'Protein Timing', desc: 'Distribute protein intake evenly across meals for optimal muscle synthesis.' }
]

const Recommendations = () => {
  const { user } = useAuth()
  const [selectedGoal, setSelectedGoal] = useState('balanced')

  const currentHour = new Date().getHours()
  const getSuggestedMealType = () => {
    if (currentHour < 11) return 'breakfast'
    if (currentHour < 15) return 'lunch'
    if (currentHour < 19) return 'dinner'
    return 'snack'
  }

  const suggestedMealType = getSuggestedMealType()

  const goals = [
    { id: 'balanced', label: 'Balanced Diet' },
    { id: 'highProtein', label: 'High Protein' },
    { id: 'lowCarb', label: 'Low Carb' },
    { id: 'vegan', label: 'Plant-Based' }
  ]

  return (
    <div className="recommendations">
      <h1>Nutrition Recommendations</h1>
      <p className="page-subtitle">Personalized meal ideas and nutrition tips for your goals</p>

      <div className="card">
        <div className="card-header">Your Goals</div>
        <div className="goal-selector">
          {goals.map(goal => (
            <button
              key={goal.id}
              className={`goal-btn ${selectedGoal === goal.id ? 'active' : ''}`}
              onClick={() => setSelectedGoal(goal.id)}
            >
              {goal.label}
            </button>
          ))}
        </div>
        {user?.healthGoals && <p className="user-goal-note">Your goal: {user.healthGoals}</p>}
      </div>

      <div className="card">
        <div className="card-header">
          Suggested Meals for {suggestedMealType.charAt(0).toUpperCase() + suggestedMealType.slice(1)}
          <span className="suggestion-badge">Based on your {selectedGoal === 'balanced' ? 'balanced' : selectedGoal} preference</span>
        </div>
        <div className="meal-suggestions">
          {mealIdeas[suggestedMealType]?.[selectedGoal]?.map((meal, idx) => (
            <div key={idx} className="suggestion-item">
              <span className="suggestion-number">{idx + 1}</span>
              <span className="suggestion-text">{meal}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-header">Suggested Meals - All Day</div>
        <div className="all-meals-grid">
          {Object.entries(mealIdeas).map(([type, goalsData]) => (
            <div key={type} className="meal-category">
              <h3 className="meal-category-title">{type.charAt(0).toUpperCase() + type.slice(1)}</h3>
              <ul className="meal-category-list">
                {goalsData[selectedGoal]?.slice(0, 2).map((meal, idx) => (
                  <li key={idx}>{meal}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-header">Nutrition Tips</div>
        <div className="tips-grid">
          {dietTips.map((tip, idx) => (
            <div key={idx} className="tip-card">
              <span className="tip-icon">{tip.icon}</span>
              <div>
                <h4 className="tip-title">{tip.title}</h4>
                <p className="tip-desc">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="disclaimer-card">
        <strong>Disclaimer:</strong> These recommendations are for informational purposes only and should not replace professional medical or dietary advice. Consult a qualified healthcare provider for personalized guidance.
      </div>
    </div>
  )
}

export default Recommendations
