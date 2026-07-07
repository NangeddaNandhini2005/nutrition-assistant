const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  caloriesPer100g: { type: Number, required: true },
  proteinPer100g: { type: Number, default: 0 },
  carbsPer100g: { type: Number, default: 0 },
  fatPer100g: { type: Number, default: 0 },
  fiberPer100g: { type: Number, default: 0 },
  servingSize: { type: Number, default: 100 },
  servingUnit: { type: String, default: 'g' }
});

module.exports = mongoose.model('FoodItem', foodItemSchema);
