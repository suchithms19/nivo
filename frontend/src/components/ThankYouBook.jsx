import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BACKEND_URL from '../config';

const ThankYouBook = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      if (!location.state?.userId) {
        navigate('/');
        return;
      }

      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/user/businessName/${location.state.userId}`);
        setBusinessName(response.data.businessName);
        
        // Format the appointment time
        if (location.state.appointmentTime) {
          const time = new Date(location.state.appointmentTime);
          setAppointmentTime(time.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }));
        }
      } catch (error) {
        console.error('Error fetching business details:', error);
        navigate('/');
      }
    };

    fetchBusinessDetails();
  }, [location.state, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg 
              className="w-8 h-8 text-green-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Booking Confirmed!
          </h2>
          <p className="text-gray-600 mb-4">
            Thank you for booking with{' '}
            <span className="font-semibold capitalize">{businessName}</span>
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">
            Your Booking Details
          </h3>
          <p className="text-gray-600">
            {appointmentTime}
          </p>
        </div>

        <div className="space-y-4">
          {/* <p className="text-sm text-gray-600">
            Please arrive 5-10 minutes before your scheduled booking time.
          </p> */}
          <div className="border-t pt-4">
            <button
              onClick={() => window.location.href = '/'}
              className="bg-cuspurple text-white px-6 py-2 rounded-md hover:scale-105 transition-transform duration-200"
            >
              Back
            </button>
          </div>
        </div>
      </div>
      
      <footer className="mt-8 text-center text-gray-600 text-sm">
        Powered by{' '}
        <a 
          href="https://getnivo.tech" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-cuspurple"
        >
          Nivo
        </a>
      </footer>
    </div>
  );
};

export default ThankYouBook;
