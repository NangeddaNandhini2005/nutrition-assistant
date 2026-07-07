const mongoose = require('mongoose');

const mealItemSchema = new mongoose.Schema({
  foodName: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'g' },
  calories: { type: Number, required: true },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  fiber: { type: Number, default: 0 }
});

const mealSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mealType: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'], required: true },
  items: [mealItemSchema],
  date: { type: Date, default: Date.now },
  totalCalories: { type: Number, default: 0 },
  totalProtein: { type: Number, default: 0 },
  totalCarbs: { type: Number, default: 0 },
  totalFat: { type: Number, default: 0 },
  notes: { type: String }
});

mealSchema.pre('save', function (next) {
  this.totalCalories = this.items.reduce((sum, item) => sum + item.calories, 0);
  this.totalProtein = this.items.reduce((sum, item) => sum + item.protein, 0);
  this.totalCarbs = this.items.reduce((sum, item) => sum + item.carbs, 0);
  this.totalFat = this.items.reduce((sum, item) => sum + item.fat, 0);
  next();
});

module.exports = mongoose.model('Meal', mealSchema);
