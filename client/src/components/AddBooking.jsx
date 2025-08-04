import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BACKEND_URL from '../config';
import { InputField } from './AddCustomerForm';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import {jwtDecode } from 'jwt-decode';
import { getUser } from '../hooks'; 

const AddBooking = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    age: '',
  });
  const [error, setError] = useState('');
  const { user, loadingUser } = getUser(); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const userId = decoded.userId;

        const dateToFetch = new Date(selectedDate);
        dateToFetch.setHours(0, 0, 0, 0);
        
        const istDate = new Date(dateToFetch.toLocaleString('en-US', {
          timeZone: 'Asia/Kolkata'
        }));
        
        const utcDate = new Date(istDate.getTime() - (istDate.getTimezoneOffset() * 60000));

        const response = await axios.get(
          `${BACKEND_URL}/api/v1/appointment/available-slots/${userId}/${utcDate.toISOString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        const sortedSlots = response.data.sort((a, b) => 
          new Date(a.startTime) - new Date(b.startTime)
        );
        
        setAvailableSlots(sortedSlots);
        setSelectedSlot(null);
      } catch (err) {
        console.error('Error fetching slots:', err);
        setError('Failed to fetch available slots.');
      }
    };

    fetchAvailableSlots();
  }, [selectedDate, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    const token = localStorage.getItem('token');
    
    if (!formData.name || !formData.phoneNumber || !selectedSlot) {
      setError('Name, phone number, and time slot are required.');
      setIsSubmitting(false);
      return;
    }
    
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/appointment/add-booking`,
        {
          ...formData,
          startTime: selectedSlot.startTime
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.status === 201) {
        navigate('/waitlist');
      }
    } catch (err) {
      console.error('Error booking appointment:', err);
      if (err.response?.status === 400) {
        setError(err.response.data.message);
        const decoded = jwt_decode(token);
        const userId = decoded.userId;
        const slotsResponse = await axios.get(
          `${BACKEND_URL}/api/v1/appointment/available-slots/${userId}/${selectedDate.toISOString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setAvailableSlots(slotsResponse.data);
        setSelectedSlot(null);
      } else {
        setError('Failed to book appointment. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    });
  };

  const getAvailableDates = () => {
    const dates = [];
    const currentDate = new Date(new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata'
    }));
    currentDate.setHours(0, 0, 0, 0);
    
    while (dates.length < 5) {
      const day = currentDate.getDay();
      if ((day !== 0 || user?.businessHours?.sundayOpen) && 
          (day !== 6 || user?.businessHours?.saturdayOpen)) {
        dates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  if (loadingUser) return (  
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-gray-600">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/waitlist')}
          className="mb-4 flex items-center text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Waitlist
        </button>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Booking</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField 
              label="Name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
            <InputField 
              label="Phone Number" 
              name="phoneNumber" 
              value={formData.phoneNumber} 
              onChange={handleChange} 
              type="tel" 
              required 
            />
            <InputField 
              label="Age (optional)" 
              name="age" 
              value={formData.age} 
              onChange={handleChange} 
              type="number" 
            />
            
            {/* Date Selection */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Select Date
              </label>
              <div className="grid grid-cols-5 gap-2">
                {getAvailableDates().map((date, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`p-2 text-sm rounded-md text-center ${
                      selectedDate.toDateString() === date.toDateString()
                        ? 'bg-cuspurple text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    } transition-colors duration-200`}
                    onClick={() => setSelectedDate(date)}
                  >
                    <div className="text-xs sm:text-sm">{formatDate(date)}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Available Slots
              </label>
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map((slot, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`p-2 text-sm rounded-md ${
                      selectedSlot === slot
                        ? 'bg-cuspurple text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    } transition-colors duration-200`}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {formatTime(slot.startTime)}
                  </button>
                ))}
                {availableSlots.length === 0 && (
                  <p className="col-span-3 text-center text-gray-500 py-2">
                    No available slots for this date
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-2 px-4 rounded-md transition-all duration-200 ${
                !selectedSlot || isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-cuspurple hover:scale-105'
              } text-white`}
              disabled={!selectedSlot || isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Booking...
                </span>
              ) : (
                'Book Appointment'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBooking;