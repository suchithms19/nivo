import React, { useState } from 'react';
import { Check, Bell, Trash2 } from 'lucide-react';
import axios from 'axios';
import BACKEND_URL from '../config';

const BookingRow = ({ booking }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showMoveConfirm, setShowMoveConfirm] = useState(false);

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const moveToWaitlist = async () => {
    const token = localStorage.getItem('token');
    
    try {
      await axios.post(
        `${BACKEND_URL}/api/v1/appointment/move-to-waitlist/${booking._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
      window.location.reload(); // Refresh the page to show updated status
    } catch (error) {
      console.error('Error moving to waitlist:', error);
    }
  };

  const cancelBooking = async () => {
    const token = localStorage.getItem('token');
    
    try {
      await axios.put(
        `${BACKEND_URL}/api/v1/appointment/cancel-booking/${booking._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
      window.location.reload(); // Refresh the page to show updated status
    } catch (error) {
      console.error('Error canceling booking:', error);
    }
  };

  return (
    <div className="my-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 cursor-pointer transform">
      <div className="flex flex-col">
        {/* Top Section - Name and Actions */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-base font-medium text-gray-900 capitalize">
                {booking.patientId.name}
              </h3>
              {booking.patientId.selfRegistered && (
                <span className="text-xs text-cuspurple bg-purple-50 px-2 py-0.5 rounded-full">
                  Self-Reg
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              +91 {booking.patientId.phoneNumber}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setShowMoveConfirm(true)}
              className="p-1.5 rounded-full hover:bg-green-100 transition-colors duration-200"
              title="Move to Waitlist"
            >
              <Check className="w-4 h-4 text-green-500" />
            </button>
            <button 
              className="p-1.5 rounded-full text-yellow-500 hover:bg-yellow-100"
              title="Notify Customer"
            >
              <Bell className="w-4 h-4" />
            </button>
            {booking.status === 'scheduled' && (
              <button 
                onClick={() => setShowConfirm(true)}
                className="p-1.5 rounded-full text-red-500 hover:bg-red-100"
                title="Cancel Booking"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Section - Time */}
        <div className="mt-2 text-xs font-medium text-gray-500">
          Time: {formatTime(booking.startTime)}
        </div>
      </div>

      {/* Move to Waitlist Confirmation Modal */}
      {showMoveConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="mb-4">Move this booking to waitlist?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowMoveConfirm(false)}
                className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:scale-105 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  moveToWaitlist();
                  setShowMoveConfirm(false);
                }}
                className="bg-cuspurple text-white py-2 px-4 rounded-md hover:scale-105 transition-colors duration-200"
              >
                Move to Waitlist
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="mb-4">Are you sure you want to cancel this booking?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:scale-105  transition-colors duration-200"
              >
                No, Keep
              </button>
              <button
                onClick={() => {
                  cancelBooking();
                  setShowConfirm(false);
                }}
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:scale-105 transition-colors duration-200"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingRow;
