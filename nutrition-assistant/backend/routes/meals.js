const express = require('express');
const Meal = require('../models/Meal');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const { date, startDate, endDate } = req.query;
    let query = { user: req.user._id };

    if (date) {
      const queryDate = new Date(date);
      query.date = {
        $gte: new Date(queryDate.setHours(0, 0, 0, 0)),
        $lt: new Date(queryDate.setHours(23, 59, 59, 999))
      };
    } else if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lt: new Date(endDate)
      };
    }

    const meals = await Meal.find(query).sort({ date: -1 });
    res.json(meals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { mealType, items, date, notes } = req.body;
    const meal = await Meal.create({
      user: req.user._id,
      mealType,
      items,
      date: date || Date.now(),
      notes
    });
    res.status(201).json(meal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/today', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const meals = await Meal.find({
      user: req.user._id,
      date: { $gte: today, $lt: tomorrow }
    }).sort({ date: -1 });

    const summary = {
      meals,
      totalCalories: meals.reduce((sum, m) => sum + m.totalCalories, 0),
      totalProtein: meals.reduce((sum, m) => sum + m.totalProtein, 0),
      totalCarbs: meals.reduce((sum, m) => sum + m.totalCarbs, 0),
      totalFat: meals.reduce((sum, m) => sum + m.totalFat, 0)
    };

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);
    if (meal && meal.user.toString() === req.user._id.toString()) {
      res.json(meal);
    } else {
      res.status(404).json({ message: 'Meal not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);
    if (meal && meal.user.toString() === req.user._id.toString()) {
      await meal.deleteOne();
      res.json({ message: 'Meal removed' });
    } else {
      res.status(404).json({ message: 'Meal not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
