const express = require('express');
const router = express.Router();
const { Appointment, Patient, User, Queue } = require('../db');
const { authenticateToken } = require('../middleware');

// Get available slots for a specific date
router.get('/available-slots/:userId/:date', async (req, res) => {
  try {
    const { userId, date } = req.params;
    const selectedDate = new Date(date);
    
    // Get user and their business hours
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Convert to IST for slot generation
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    
    // Set to midnight IST of the selected date
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    // Use business hours from user settings
    const { startHour, startMinute, endHour, endMinute } = user.businessHours;
    
    // Get all SCHEDULED appointments for the selected date
    const existingAppointments = await Appointment.find({
      userId,
      status: 'scheduled',
      startTime: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    });

    // Generate all possible 30-minute slots in IST
    const availableSlots = [];
    const currentDate = new Date(selectedDate);
    
    // Convert business hours to minutes for easier comparison
    const startTimeInMinutes = startHour * 60 + startMinute;
    const endTimeInMinutes = endHour * 60 + endMinute;
    
    for (let timeInMinutes = startTimeInMinutes; timeInMinutes < endTimeInMinutes; timeInMinutes += 30) {
      const hour = Math.floor(timeInMinutes / 60);
      const minute = timeInMinutes % 60;
      
      // Create slot time in IST
      const slotStart = new Date(currentDate);
      slotStart.setHours(hour, minute, 0, 0);
      
      // Convert IST slot to UTC for storage
      const utcSlotStart = new Date(slotStart.getTime() - istOffset);
      
      // Don't show past slots for today
      const nowInIST = new Date(Date.now() + istOffset);
      if (selectedDate.toDateString() === nowInIST.toDateString() && 
          slotStart < nowInIST) {
        continue;
      }

      const utcSlotEnd = new Date(utcSlotStart.getTime() + 30 * 60000);

      // Check if slot is already booked
      const isBooked = existingAppointments.some(apt => {
        const aptStart = new Date(apt.startTime);
        return aptStart.getTime() === utcSlotStart.getTime();
      });

      if (!isBooked) {
        availableSlots.push({
          startTime: utcSlotStart.toISOString(),
          endTime: utcSlotEnd.toISOString()
        });
      }
    }

    res.json(availableSlots);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching available slots', error: error.message });
  }
});

// Book an appointment
router.post('/book/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { startTime, name, phoneNumber, age } = req.body;
    
    const appointmentStartTime = new Date(startTime);

    // Check if slot is already booked
    const existingAppointment = await Appointment.findOne({
      userId,
      status:'scheduled',
      startTime: appointmentStartTime
    });

    if (existingAppointment) {
      return res.status(400).json({ 
        message: 'This slot is no longer available. Please choose another time.' 
      });
    }

    // Create patient first
    const patient = new Patient({
      userId,
      name,
      phoneNumber,
      age,
      entryTime: appointmentStartTime,
      date: appointmentStartTime,
      selfRegistered: true
    });
    await patient.save();

    // Create appointment
    const appointment = new Appointment({
      userId,
      patientId: patient._id,
      startTime: appointmentStartTime,
      endTime: new Date(appointmentStartTime.getTime() + 30 * 60000)
    });
    await appointment.save();

    // Update user counts
    const user = await User.findById(userId);
    await user.resetDailyCountIfNeeded();
    user.totalPatients += 1;
    user.dailyPatients += 1;
    await user.save();

    res.status(201).json({ 
      message: 'Appointment booked successfully', 
      appointment,
      patient 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error booking appointment', error: error.message });
  }
});

// Get user's appointments
router.get('/user-appointments', authenticateToken, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user.userId })
      .populate('patientId')
      .sort('startTime');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
});

// Cancel appointment
router.put('/cancel/:appointmentId', authenticateToken, async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { 
        _id: req.params.appointmentId,
        userId: req.user.userId 
      },
      { status: 'cancelled' },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment cancelled successfully', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling appointment', error: error.message });
  }
});

// Add this new route to your appointment.js
router.get('/today-bookings', authenticateToken, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const bookings = await Appointment.find({
      userId: req.user.userId,
      status: 'scheduled',
      startTime: {
        $gte: today,
        $lt: tomorrow
      }
    }).populate('patientId');

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching today\'s bookings', 
      error: error.message 
    });
  }
});

// Add this new route for authenticated booking
router.post('/add-booking', authenticateToken, async (req, res) => {
  try {
    const { name, phoneNumber, age, startTime } = req.body;
    const userId = req.user.userId;
    
    const appointmentStartTime = new Date(startTime);

    // Check if slot is already booked
    const existingAppointment = await Appointment.findOne({
      userId,
      status: 'scheduled',
      startTime: appointmentStartTime
    });

    if (existingAppointment) {
      return res.status(400).json({ 
        message: 'This slot is no longer available. Please choose another time.' 
      });
    }

    // Create patient
    const patient = new Patient({
      userId,
      name,
      phoneNumber,
      age,
      entryTime: appointmentStartTime,
      date: appointmentStartTime
    });
    await patient.save();

    // Create appointment
    const appointment = new Appointment({
      userId,
      patientId: patient._id,
      startTime: appointmentStartTime,
      endTime: new Date(appointmentStartTime.getTime() + 30 * 60000)
    });
    await appointment.save();

    // Update user counts
    const user = await User.findById(userId);
    await user.resetDailyCountIfNeeded();
    user.totalPatients += 1;
    user.dailyPatients += 1;
    await user.save();

    res.status(201).json({ 
      message: 'Appointment booked successfully', 
      appointment,
      patient 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error booking appointment', error: error.message });
  }
});

// Add this new route for canceling a booking
router.put('/cancel-booking/:appointmentId', authenticateToken, async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { 
        _id: req.params.appointmentId,
        userId: req.user.userId,
        status: 'scheduled' // Only allow canceling scheduled appointments
      },
      { 
        status: 'cancelled',
        updatedAt: Date.now()
      },
      { new: true }
    ).populate('patientId');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found or already cancelled' });
    }

    // Update the patient record
    await Patient.findByIdAndUpdate(
      appointment.patientId._id,
      { canceled: true }
    );

    res.json({ message: 'Appointment cancelled successfully', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling appointment', error: error.message });
  }
});

// Update the move-to-waitlist endpoint
router.post('/move-to-waitlist/:appointmentId', authenticateToken, async (req, res) => {
  try {
    // Find and update the appointment
    const appointment = await Appointment.findOne({ 
      _id: req.params.appointmentId,
      userId: req.user.userId,
      status: 'scheduled'
    }).populate('patientId');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found or not in scheduled status' });
    }

    // Update appointment status
    appointment.status = 'completed';
    await appointment.save();

    // Update patient's entry time
    const patient = await Patient.findByIdAndUpdate(
      appointment.patientId._id,
      { 
        entryTime: new Date(),
        date: new Date()
      },
      { new: true }
    );

    // Create queue entry (matching queue.js structure)
    const queueEntry = new Queue({
      userId: req.user.userId,
      patient: patient._id,
      status: 'waiting',
      timeWaited: 0,
      timeServed: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await queueEntry.save();


    res.status(201).json({ 
      message: 'Patient added to waitlist', 
      patient, 
      queueEntry 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error moving appointment to waitlist', 
      error: error.message 
    });
  }
});

module.exports = router; 