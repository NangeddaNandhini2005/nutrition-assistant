const mongoose = require('mongoose');
const dotenv = require('dotenv');
const FoodItem = require('./models/FoodItem');

dotenv.config();

const foods = [
  { name: 'Rice (cooked)', category: 'Grains', caloriesPer100g: 130, proteinPer100g: 2.7, carbsPer100g: 28, fatPer100g: 0.3, fiberPer100g: 0.4 },
  { name: 'Chicken Breast', category: 'Meat', caloriesPer100g: 165, proteinPer100g: 31, carbsPer100g: 0, fatPer100g: 3.6, fiberPer100g: 0 },
  { name: 'Egg (whole)', category: 'Dairy', caloriesPer100g: 155, proteinPer100g: 13, carbsPer100g: 1.1, fatPer100g: 11, fiberPer100g: 0 },
  { name: 'Banana', category: 'Fruits', caloriesPer100g: 89, proteinPer100g: 1.1, carbsPer100g: 23, fatPer100g: 0.3, fiberPer100g: 2.6 },
  { name: 'Apple', category: 'Fruits', caloriesPer100g: 52, proteinPer100g: 0.3, carbsPer100g: 14, fatPer100g: 0.2, fiberPer100g: 2.4 },
  { name: 'Bread (whole wheat)', category: 'Grains', caloriesPer100g: 247, proteinPer100g: 13, carbsPer100g: 41, fatPer100g: 3.4, fiberPer100g: 7 },
  { name: 'Milk (whole)', category: 'Dairy', caloriesPer100g: 61, proteinPer100g: 3.2, carbsPer100g: 4.8, fatPer100g: 3.3, fiberPer100g: 0 },
  { name: 'Broccoli', category: 'Vegetables', caloriesPer100g: 34, proteinPer100g: 2.8, carbsPer100g: 7, fatPer100g: 0.4, fiberPer100g: 2.6 },
  { name: 'Salmon', category: 'Meat', caloriesPer100g: 208, proteinPer100g: 20, carbsPer100g: 0, fatPer100g: 13, fiberPer100g: 0 },
  { name: 'Sweet Potato', category: 'Vegetables', caloriesPer100g: 86, proteinPer100g: 1.6, carbsPer100g: 20, fatPer100g: 0.1, fiberPer100g: 3 },
  { name: 'Oats', category: 'Grains', caloriesPer100g: 389, proteinPer100g: 16.9, carbsPer100g: 66, fatPer100g: 6.9, fiberPer100g: 10.6 },
  { name: 'Greek Yogurt', category: 'Dairy', caloriesPer100g: 59, proteinPer100g: 10, carbsPer100g: 3.6, fatPer100g: 0.7, fiberPer100g: 0 },
  { name: 'Almonds', category: 'Nuts', caloriesPer100g: 579, proteinPer100g: 21, carbsPer100g: 22, fatPer100g: 50, fiberPer100g: 12.5 },
  { name: 'Avocado', category: 'Fruits', caloriesPer100g: 160, proteinPer100g: 2, carbsPer100g: 8.5, fatPer100g: 14.7, fiberPer100g: 6.7 },
  { name: 'Tuna (canned)', category: 'Meat', caloriesPer100g: 132, proteinPer100g: 28, carbsPer100g: 0, fatPer100g: 1.5, fiberPer100g: 0 },
  { name: 'Pasta (whole wheat)', category: 'Grains', caloriesPer100g: 124, proteinPer100g: 5.3, carbsPer100g: 26, fatPer100g: 0.5, fiberPer100g: 3.5 },
  { name: 'Spinach', category: 'Vegetables', caloriesPer100g: 23, proteinPer100g: 2.9, carbsPer100g: 3.6, fatPer100g: 0.4, fiberPer100g: 2.2 },
  { name: 'Quinoa', category: 'Grains', caloriesPer100g: 120, proteinPer100g: 4.4, carbsPer100g: 21, fatPer100g: 1.9, fiberPer100g: 2.8 },
  { name: 'Lentils', category: 'Vegetables', caloriesPer100g: 116, proteinPer100g: 9, carbsPer100g: 20, fatPer100g: 0.4, fiberPer100g: 7.9 },
  { name: 'Tofu', category: 'Vegetables', caloriesPer100g: 76, proteinPer100g: 8, carbsPer100g: 1.9, fatPer100g: 4.8, fiberPer100g: 0.3 },
  { name: 'Beef (lean)', category: 'Meat', caloriesPer100g: 250, proteinPer100g: 26, carbsPer100g: 0, fatPer100g: 15, fiberPer100g: 0 },
  { name: 'Cheese (cheddar)', category: 'Dairy', caloriesPer100g: 403, proteinPer100g: 25, carbsPer100g: 1.3, fatPer100g: 33, fiberPer100g: 0 },
  { name: 'Orange', category: 'Fruits', caloriesPer100g: 47, proteinPer100g: 0.9, carbsPer100g: 12, fatPer100g: 0.1, fiberPer100g: 2.4 },
  { name: 'Potato', category: 'Vegetables', caloriesPer100g: 77, proteinPer100g: 2, carbsPer100g: 17, fatPer100g: 0.1, fiberPer100g: 2.2 },
  { name: 'Chickpeas', category: 'Vegetables', caloriesPer100g: 139, proteinPer100g: 7.6, carbsPer100g: 22, fatPer100g: 2.6, fiberPer100g: 7.6 },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    await FoodItem.deleteMany({});
    console.log('Cleared existing foods');

    await FoodItem.insertMany(foods);
    console.log(`Seeded ${foods.length} food items`);

    await mongoose.disconnect();
    console.log('Done');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

seedDB();
