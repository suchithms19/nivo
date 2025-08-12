import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BACKEND_URL from '../config';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { getUser } from '../hooks';

export function BookingView() {
  const [appointments, setAppointments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateIndex, setDateIndex] = useState(0);
  const { user, loadingUser } = getUser();

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/v1/appointment/user-appointments`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        // Create a structured object for appointments
        const grouped = {};
        response.data.forEach(appointment => {
          const date = new Date(appointment.startTime).toDateString();
          const time = new Date(appointment.startTime).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });
          
          if (!grouped[date]) {
            grouped[date] = {};
          }
          if (!grouped[date][time]) {
            grouped[date][time] = [];
          }
          grouped[date][time].push(appointment);
        });

        setAppointments(grouped);
      } catch (err) {
        setError('Failed to fetch appointments');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Get all dates from Dec 1 to current date + 7 days
  const getAllDates = () => {
    const dates = [];
    const startDate = new Date(); // Start from today
    startDate.setDate(startDate.getDate() - 2); // Show 7 days before today
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 15); // Show next 15 days
    
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      // Check if the day is valid based on user settings
      const day = currentDate.getDay();
      if ((day !== 0 || user?.businessHours?.sundayOpen) && 
          (day !== 6 || user?.businessHours?.saturdayOpen)) {
        dates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  // Modified getTimeSlots function to handle minutes
  const getTimeSlots = () => {
    const slots = [];
    const startHour = user?.businessHours?.startHour || 9;
    const startMinute = user?.businessHours?.startMinute || 0;
    const endHour = user?.businessHours?.endHour || 17;
    const endMinute = user?.businessHours?.endMinute || 0;
    
    // Convert to minutes for easier calculation
    const startTimeInMinutes = startHour * 60 + startMinute;
    const endTimeInMinutes = endHour * 60 + endMinute;
    
    // Generate slots in 30-minute intervals
    for (let timeInMinutes = startTimeInMinutes; timeInMinutes < endTimeInMinutes; timeInMinutes += 30) {
      const hour = Math.floor(timeInMinutes / 60);
      const minute = timeInMinutes % 60;
      slots.push(
        `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      );
    }
    return slots;
  };

  const allDates = getAllDates();
  const timeSlots = getTimeSlots();
  const visibleDates = allDates.slice(dateIndex, dateIndex + 3);
  const hasMoreDates = dateIndex + 3 < allDates.length;
  const hasPreviousDates = dateIndex > 0;

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const formatDisplayTime = (time) => {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    });
  };

  // Helper function to get appointments for a specific time slot
  const getAppointmentsForTimeSlot = (date, time) => {
    if (!appointments[date]?.[time]) return [];
    
    return appointments[date][time].sort((a, b) => {
      if (a.status === 'scheduled' && b.status !== 'scheduled') return -1;
      if (a.status !== 'scheduled' && b.status === 'scheduled') return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  if (loading || loadingUser) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-gray-600">Loading bookings...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Header with Navigation */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Bookings Overview
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setDateIndex(prev => Math.max(0, prev - 3))}
                disabled={!hasPreviousDates}
                className={`p-2 rounded-full ${
                  hasPreviousDates 
                    ? 'bg-cuspurple text-white hover:scale-105' 
                    : 'bg-cuspurple text-white cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setDateIndex(prev => prev + 3)}
                disabled={!hasMoreDates}
                className={`p-2 rounded-full ${
                  hasMoreDates 
                    ? 'bg-cuspurple text-white hover:scale-105' 
                    : 'bg-cuspurple text-white cursor-not-allowed'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Timeline View */}
          <div className="grid grid-cols-[auto,1fr,1fr,1fr] gap-4">
            {/* Time slots column */}
            <div className="pt-14">
              {timeSlots.map(time => (
                <div key={time} className="h-16 flex items-center justify-end pr-4 text-sm text-gray-500">
                  {formatDisplayTime(time)}
                </div>
              ))}
            </div>

            {/* Date columns */}
            {visibleDates.map(date => (
              <div key={date.toDateString()} className="flex flex-col">
                {/* Date header */}
                <div className="h-14 flex items-center justify-center bg-gray-50 rounded-lg mb-4">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-800">
                      {formatDate(date)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {Object.values(appointments[date.toDateString()] || {})
                        .flat()
                        .length} bookings
                    </div>
                  </div>
                </div>

                {/* Time slots */}
                {timeSlots.map(time => {
                  const appointmentsAtTime = getAppointmentsForTimeSlot(date.toDateString(), time);

                  return (
                    <div 
                      key={`${date.toDateString()}-${time}`} 
                      className="h-16 border-l-2 border-gray-100 pl-2"
                    >
                      {appointmentsAtTime.length > 0 ? (
                        <div className="h-14 flex gap-1 overflow-hidden relative">
                          {appointmentsAtTime.slice(0, 3).map((appointment, index) => (
                            <div 
                              key={appointment._id}
                              className={`flex-1 p-2 text-xs rounded-lg border ${
                                appointment.status === 'scheduled'
                                  ? 'bg-purple-50 border-purple-100'
                                  : appointment.status === 'completed'
                                  ? 'bg-green-50 border-green-100'
                                  : 'bg-red-50 border-red-100'
                              }`}
                            >
                              <div className="font-medium text-gray-900 flex items-center gap-1">
                                {appointment.patientId.name}
                                {/* {appointment.status !== 'scheduled' && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100">
                                    {appointment.status}
                                  </span>
                                )} */}
                              </div>
                              <div className="text-gray-500">
                                +91 {appointment.patientId.phoneNumber}
                              </div>
                            </div>
                          ))}
                          {appointmentsAtTime.length > 3 && (
                            <div className="absolute right-0 top-3 -translate-y-1/2 text-xs text-gray-500">
                              +{appointmentsAtTime.length - 3} 
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="h-14 border border-dashed border-gray-200 rounded-lg"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}