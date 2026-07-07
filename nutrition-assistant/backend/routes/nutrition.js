const express = require('express');
const FoodItem = require('../models/FoodItem');
const Meal = require('../models/Meal');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/foods', async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }

    const foods = await FoodItem.find(query).limit(50);
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/foods', async (req, res) => {
  try {
    const food = await FoodItem.create(req.body);
    res.status(201).json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/daily-summary', protect, async (req, res) => {
  try {
    const { date } = req.query;
    const queryDate = date ? new Date(date) : new Date();
    queryDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(queryDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const meals = await Meal.find({
      user: req.user._id,
      date: { $gte: queryDate, $lt: nextDay }
    });

    res.json({
      date: queryDate,
      totalCalories: meals.reduce((sum, m) => sum + m.totalCalories, 0),
      totalProtein: meals.reduce((sum, m) => sum + m.totalProtein, 0),
      totalCarbs: meals.reduce((sum, m) => sum + m.totalCarbs, 0),
      totalFat: meals.reduce((sum, m) => sum + m.totalFat, 0),
      mealCount: meals.length,
      meals
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/weekly-summary', protect, async (req, res) => {
  try {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const meals = await Meal.find({
      user: req.user._id,
      date: { $gte: weekAgo, $lte: today }
    }).sort({ date: 1 });

    const dailyTotals = {};
    meals.forEach(meal => {
      const dayKey = meal.date.toISOString().split('T')[0];
      if (!dailyTotals[dayKey]) {
        dailyTotals[dayKey] = { calories: 0, protein: 0, carbs: 0, fat: 0 };
      }
      dailyTotals[dayKey].calories += meal.totalCalories;
      dailyTotals[dayKey].protein += meal.totalProtein;
      dailyTotals[dayKey].carbs += meal.totalCarbs;
      dailyTotals[dayKey].fat += meal.totalFat;
    });

    res.json({
      startDate: weekAgo,
      endDate: today,
      dailyTotals,
      totalMeals: meals.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
