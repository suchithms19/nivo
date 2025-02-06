import React, { useState } from 'react';
import axios from 'axios';
import BACKEND_URL from '../config';
import RealTimeWaitTime from './RealTime';
import { Bell, Check, Trash2 } from 'lucide-react';

const PatientRow = ({ patient, section }) => {
  const [showConfirm, setShowConfirm] = useState(false);
 

  const changeWaittoServe = async () => {
    const token = localStorage.getItem('token');
    
    try {
      await axios.put(
        `${BACKEND_URL}/api/v1/queue/patient/${patient._id}/serve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
      window.location.reload() //to reload page
      console.log('Status changed to Serve');
    } catch (error) {
      console.error('Error changing status to Serve:', error);
    }
  };
  
  const changeServetoComplete = async () => {
    const token = localStorage.getItem('token');
    
    try {
      await axios.put(
        `${BACKEND_URL}/api/v1/queue/patient/${patient._id}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
      window.location.reload()
      console.log('Status changed to Complete');
    } catch (error) {
      console.error('Error changing status to Complete:', error);
    }
  };

  const cancelPatient = async () => {
    const token = localStorage.getItem('token');
    
    try {
      await axios.put(
        `${BACKEND_URL}/api/v1/queue/patient/${patient._id}/cancelled`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
      window.location.reload() //to reload page
      console.log('Patient marked as canceled');
    } catch (error) {
      console.error('Error canceling patient:', error);
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
                {patient.name}
              </h3>
              {patient.selfRegistered && (
                <span className="text-xs text-cuspurple bg-purple-50 px-2 py-0.5 rounded-full">
                  Self-Reg
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              +91 {patient.phoneNumber}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button 
              onClick={section === 'waitlist' ? changeWaittoServe : changeServetoComplete}
              className="p-1.5 rounded-full hover:bg-green-100 transition-colors duration-200"
              title={section === 'waitlist' ? 'Move to Serving' : 'Complete'}
            >
              <Check className="w-4 h-4 text-green-500" />
            </button>
            <button 
              className="p-1.5 rounded-full text-yellow-500 hover:bg-yellow-100"
              title="Notify Customer"
            >
              <Bell className="w-4 h-4" />
            </button>
            {section === 'waitlist' && (
              <button 
                onClick={() => setShowConfirm(true)}
                className="p-1.5 rounded-full text-red-500 hover:bg-red-100"
                title="Delete Customer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Section - Time */}
        <div className="mt-2 text-xs font-medium text-gray-500">
          {section === 'waitlist' ? 'Waiting: ' : 'Serving: '}
          <span className="text-gray-500">
            <RealTimeWaitTime entryTime={
              section === 'waitlist' ? patient.entryTime : patient.postConsultation
            } />
          </span>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="mb-4">Are you sure you want to cancel this patient?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:scale-105 "
              >
                No, Keep
              </button>
              <button
                onClick={() => {
                  cancelPatient();
                  setShowConfirm(false);
                }}
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:scale-105  "
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

export default PatientRow;