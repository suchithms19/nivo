const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User,Queue } = require('../db');
const { LoginSchema, RegisterSchema } = require('../zod');
const { validate, authenticateToken, isAdmin } = require('../middleware');

// Signup endpoint
router.post('/signup', validate(RegisterSchema), async (req, res) => {
  try {
    const { email, password, businessName } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create URL-friendly business name
    const businessNameForUrl = businessName
      .toLowerCase()
      .replace(/\s+/g, '') // Remove all spaces
      .replace(/[^a-z0-9-]/g, ''); // Remove special characters except hyphen

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      email,
      password: hashedPassword,
      businessName,
      businessNameForUrl,
      role: 'user' // Default role
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login endpoint
router.post('/login', validate(LoginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin route to get all users
router.get('/all', authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin route to change user role
router.put('/role/:userId', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { role },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current queue length for a specific user
router.get('/queue-status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const waitingCount = await Queue.countDocuments({
      userId,
      status: 'waiting'
    });

    const servingCount = await Queue.countDocuments({
      userId,
      status: 'serving'
    });

    res.json({
      waitingCount,
      servingCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching queue status', error: error.message });
  }
});

router.get('/businessName/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('businessName');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user information' });
  }
});

router.get('/get-user-by-business/:businessNameForUrl', async (req, res) => {
  try {
    const user = await User.findOne({ businessNameForUrl: req.params.businessNameForUrl });
    if (!user) {
      return res.status(404).json({ message: 'Business not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add this new endpoint to get patient statistics
router.get('/patient-stats', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.resetDailyCountIfNeeded(); // Check and reset daily count if needed

    res.json({
      totalPatients: user.totalPatients,
      dailyPatients: user.dailyPatients,
      lastResetDate: user.lastResetDate
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient statistics' });
  }
});

// Add this new endpoint to update business hours
router.put('/business-hours', authenticateToken, async (req, res) => {
  try {
    const { startHour, startMinute, endHour, endMinute } = req.body;
    
    // Validate hours and minutes
    if (startHour < 0 || startHour > 23 || endHour < 0 || endHour > 23 ||
        startMinute < 0 || startMinute > 59 || endMinute < 0 || endMinute > 59) {
      return res.status(400).json({ 
        message: 'Invalid time format. Hours should be 0-23 and minutes should be 0-59.' 
      });
    }

    // Convert to minutes for comparison
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    if (startTime >= endTime) {
      return res.status(400).json({ 
        message: 'End time must be after start time.' 
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { 
        'businessHours.startHour': startHour,
        'businessHours.startMinute': startMinute,
        'businessHours.endHour': endHour,
        'businessHours.endMinute': endMinute
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      message: 'Business hours updated successfully',
      businessHours: user.businessHours 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating business hours', error: error.message });
  }
});

// Add this new route to update business hours
router.put('/update-business-hours', authenticateToken, async (req, res) => {
  try {
    const { businessHours } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { businessHours },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Business hours updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating business hours', error: error.message });
  }
});

module.exports = router;