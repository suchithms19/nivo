const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/testv1');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  businessName: {
    type: String,
    required: true,
    unique: true
  },
  businessNameForUrl: {
    type: String,
    required: true,
    unique: true
  },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  totalPatients: { type: Number, default: 0 },
  dailyPatients: { type: Number, default: 0 },
  canceledPatients: { type: Number, default: 0 },
  lastResetDate: { type: Date, default: Date.now },
  businessHours: {
    startHour: { type: Number, default: 9 }, // Default 9 AM IST
    startMinute: { type: Number, default: 0 }, // Default 0 minutes
    endHour: { type: Number, default: 17 },  // Default 5 PM IST
    endMinute: { type: Number, default: 0 },  // Default 0 minutes
    sundayOpen: { type: Boolean, default: false },
    saturdayOpen: { type: Boolean, default: false }
  },
});

UserSchema.methods.resetDailyCountIfNeeded = async function () {
  const today = new Date().setHours(0, 0, 0, 0); // Normalize today's date
  const lastReset = this.lastResetDate 
    ? new Date(this.lastResetDate).setHours(0, 0, 0, 0)
    : 0; // Handle cases where lastResetDate might be undefined

  if (!this.lastResetDate || today > lastReset) {
    this.dailyPatients = 0; // Reset the count
    this.lastResetDate = new Date(); // Update to the current date
    try {
      await this.save(); // Persist changes
    } catch (error) {
      console.error("Error resetting daily count:", error);
      throw new Error("Failed to reset daily count"); // Throw or handle appropriately
    }
  }
};


const PatientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  phoneNumber: { type: Number, required: true },
  age: { type: Number },
  entryTime: { type: Date, required: true },
  postConsultation: { type: Date },
  completionTime: { type: Date },
  selfRegistered: {
    type: Boolean,
    default: false
  },
  selfCanceled: {
    type: Boolean,
    default: false
  },
  canceled: { type: Boolean, default: false }
});

const QueueSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  status: { type: String, enum: ['waiting', 'serving', 'completed','cancelled'], required: true },
  timeWaited: { type: Number, default: 0 },
  timeServed: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const AppointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['scheduled', 'completed', 'cancelled'], 
    default: 'scheduled' 
  },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Patient = mongoose.model('Patient', PatientSchema);
const Queue = mongoose.model('Queue', QueueSchema);
const Appointment = mongoose.model('Appointment', AppointmentSchema);

module.exports = { User, Patient, Queue, Appointment };