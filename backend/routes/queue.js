const express = require('express');
const { Queue, Patient, User } = require('../db');
const { authenticateToken, isAdmin } = require('../middleware');
const router = express.Router();

// Add patient to queue (authenticated user)
router.post('/patient', authenticateToken, async (req, res) => {
  try {
    const { 
      name, 
      phoneNumber,
      age
    } = req.body;

    const patient = new Patient({ 
      userId: req.user.userId,
      name, 
      entryTime: new Date(),
      date: new Date(),
      phoneNumber,
      age
    });
    await patient.save();

    const queueEntry = new Queue({
      userId: req.user.userId,
      patient: patient._id,
      status: 'waiting'
    });
    await queueEntry.save();

    // Update user counts
    const user = await User.findById(req.user.userId);
    await user.resetDailyCountIfNeeded(); // Reset daily count if it's a new day
    
    user.totalPatients += 1;
    user.dailyPatients += 1;
    await user.save();

    res.status(201).json({ message: 'Patient added to waitlist', patient, queueEntry });
  } catch (error) {
    res.status(500).json({ message: 'Error adding patient', error: error.message });
  }
});

// Get user-specific waitlist
router.get('/waitlist', authenticateToken, async (req, res) => {
  try {
    const query = { status: 'waiting' };
    if (req.user.role !== 'admin') {
      query.userId = req.user.userId;
    }
    
    const waitlist = await Queue.find(query)
      .populate('patient')
      .sort('createdAt');
    res.json(waitlist);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching waitlist', error: error.message });
  }
});



// Get user-specific serving list
router.get('/serving', authenticateToken, async (req, res) => {
  try {
    const query = { status: 'serving' };
    if (req.user.role !== 'admin') {
      query.userId = req.user.userId;
    }

    const servingList = await Queue.find(query)
      .populate('patient')
      .sort('updatedAt');
    res.json(servingList);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching serving list', error: error.message });
  }
});

// Move patient from waiting to serving
router.put('/patient/:id/serve', authenticateToken, async (req, res) => {
  try {
    const query = { 
      patient: req.params.id, 
      status: 'waiting'
    };
    if (req.user.role !== 'admin') {
      query.userId = req.user.userId;
    }

    const queueEntry = await Queue.findOneAndUpdate(
      query,
      { status: 'serving', updatedAt: Date.now() },
      { new: true }
    ).populate('patient');

    if (!queueEntry) {
      return res.status(404).json({ message: 'Patient not found in waitlist' });
    }

    await Patient.findByIdAndUpdate(queueEntry.patient._id, { 
      postConsultation: new Date() 
    });

    res.json({ message: 'Patient moved to serving', queueEntry });
  } catch (error) {
    res.status(500).json({ message: 'Error updating patient status', error: error.message });
  }
});

// Complete patient consultation
router.put('/patient/:id/complete', authenticateToken, async (req, res) => {
  try {
    const query = { 
      patient: req.params.id, 
      status: 'serving'
    };
    if (req.user.role !== 'admin') {
      query.userId = req.user.userId;
    }

    const queueEntry = await Queue.findOneAndUpdate(
      query,
      { status: 'completed', updatedAt: Date.now() },
      { new: true }
    ).populate('patient');

    if (!queueEntry) {
      return res.status(404).json({ message: 'Patient not found in serving list' });
    }

    const patient = await Patient.findByIdAndUpdate(
      queueEntry.patient._id, 
      { completionTime: new Date() },
      { new: true }
    );

    res.json({ message: 'Patient consultation completed', queueEntry, patient });
  } catch (error) {
    res.status(500).json({ message: 'Error completing patient consultation', error: error.message });
  }
});

// Get single patient details
router.get('/patient/:id', authenticateToken, async (req, res) => {
  try {
    const query = { _id: req.params.id };
    if (req.user.role !== 'admin') {
      query.userId = req.user.userId;
    }

    const patient = await Patient.findOne(query);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient details', error: error.message });
  }
});

// Get all patients (with user-specific or admin access)
router.get('/allpatient', authenticateToken, async (req, res) => {
  try {
    const query = {};
    if (req.user.role !== 'admin') {
      query.userId = req.user.userId;
    }

    const servingList = await Queue.find(query)
      .populate('patient')
      .sort('updatedAt');
    res.json(servingList);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient list', error: error.message });
  }
});

// // Update patient details
// router.put('/patient/:patientId', authenticateToken, async (req, res) => {
//   try {
//     const query = { patientId: req.params.patientId };
//     if (req.user.role !== 'admin') {
//       query.userId = req.user.userId;
//     }

//     const { 
//       name, 
//       phoneNumber,
//       age,
//     } = req.body;
    
//     const patient = await Patient.findOneAndUpdate(
//       query,
//       { 
//         name, 
//         doctorType, 
//         financialClass,
//         phoneNumber,
//         age
//       },
//       { new: true }
//     );

//     if (!patient) {
//       return res.status(404).json({ message: 'Patient not found' });
//     }

//     res.status(200).json({ 
//       message: 'Patient details updated successfully', 
//       patient
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating patient details', error: error.message });
//   }
// });



// Add patient to specific user's queue
router.post('/customeradd/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Queue not found' });
    }

    const { 
      name, 
      phoneNumber,
      age
    } = req.body;

    const patient = new Patient({ 
      userId, // Assign the patient to the specific user
      name, 
      entryTime: new Date(),
      date: new Date(),
      phoneNumber,
      age,
      selfRegistered: true // Set selfRegistered to true
    });
    await patient.save();

    const queueEntry = new Queue({
      userId, // Assign the queue entry to the specific user
      patient: patient._id,
      status: 'waiting'
    });
    await queueEntry.save();

    // Update user counts
    await user.resetDailyCountIfNeeded(); // Reset daily count if it's a new day
    
    user.totalPatients += 1;
    user.dailyPatients += 1;
    await user.save();

    res.status(201).json({ 
      message: 'Patient added to waitlist', 
      patientId: patient._id, // Return the patient ID
      queueEntry 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding patient', error: error.message });
  }
});

// Unauthenticated route to get waitlist for a specific user
router.get('/public-waitlist/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const waitlist = await Queue.find({ userId, status: 'waiting' })
      .populate('patient', 'name') // Only populate the patient's name
      .sort('createdAt');

    res.json(waitlist);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching public waitlist', error: error.message });
  }
});

// Remove patient from waitlist
router.delete('/patientremove/:id/:userId', async (req, res) => {
  try {
    const { id, userId } = req.params;

    // Find the queue entry and ensure the user can only cancel their own entry
    const queueEntry = await Queue.findOneAndUpdate(
      { patient: id, userId: userId, status: 'waiting' },
      { status: 'cancelled', updatedAt: Date.now() },
      { new: true }
    );

    if (!queueEntry) {
      return res.status(404).json({ message: 'Patient not found in waitlist or unauthorized' });
    }

    // Update the patient to mark as canceled
    const patient = await Patient.findByIdAndUpdate(id, { canceled: true, selfCanceled: true }, { new: true });

    // Update the user's canceled patients count
    const user = await User.findById(userId);
    if (user) {
      user.canceledPatients += 1;
      await user.save();
    }

    res.json({ message: 'Patient marked as canceled', patient });
  } catch (error) {
    res.status(500).json({ message: 'Error removing patient from waitlist', error: error.message });
  }
});

// Mark patient as canceled
router.put('/patient/:id/cancelled', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const query = { 
      patient: id, 
      status: 'waiting'
    };

    // Check if the user is not an admin, restrict to their own patients
    if (req.user.role !== 'admin') {
      query.userId = req.user.userId;
    }

    // Find the queue entry and update its status to 'cancelled'
    const queueEntry = await Queue.findOneAndUpdate(
      query,
      { status: 'cancelled', updatedAt: Date.now() },
      { new: true }
    ).populate('patient');

    if (!queueEntry) {
      return res.status(404).json({ message: 'Patient not found in waitlist or unauthorized' });
    }

    // Update the patient to mark as canceled
    const patient = await Patient.findByIdAndUpdate(queueEntry.patient._id, { canceled: true }, { new: true });

    // Update the user's canceled patients count
    const user = await User.findById(req.user.userId);
    if (user) {
      user.canceledPatients += 1;
      await user.save();
    }

    res.json({ message: 'Patient marked as canceled', patient });
  } catch (error) {
    res.status(500).json({ message: 'Error canceling patient', error: error.message });
  }
});

module.exports = router;