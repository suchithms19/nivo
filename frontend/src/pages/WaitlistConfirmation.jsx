import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQueueStatus } from '../hooks';
import axios from 'axios';
import BACKEND_URL from '../config';
import { useEffect } from 'react';

const WaitlistConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [doctorName, setDoctorName] = useState('');
  const patientId = location.state?.patientId;
  const userId = location.state?.userId;
  const { queueStatus, loading, error } = useQueueStatus(userId);

  const handleViewWaitlist = () => {
    navigate(`/view-waitlist/${userId}`);
  };

  const handleExitWaitlist = () => {
    setShowConfirm(true);
  };

  const confirmExit = async () => {
    try {
      if (patientId) {
        await axios.delete(`${BACKEND_URL}/api/v1/queue/patientremove/${patientId}/${userId}`);
        navigate('/');
      }
    } catch (error) {
      console.error('Error exiting waitlist:', error);
    }
  };

  useEffect(() => {
    const fetchDoctorName = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/user/businessName/${userId}`);
        setDoctorName(response.data.businessName);
      } catch (err) {
        console.error('Error fetching doctor name:', err);
      }
    };

    fetchDoctorName();
  }, [userId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="mb-6 flex items-center">
          <h1 className="ml-2 text-xl font-semibold text-gray-900">Waitlist Status</h1>
        </div>

        <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 rounded-lg text-center">
          Please do not exit this page to keep track of the real-time waitlist status.
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {loading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-600">Error fetching queue status.</p>
          ) : (
            <>
              <div className="flex items-center justify-center my-4">
                <span className="font-semibold text-xl text-gray-900 text-center capitalize">{doctorName}</span>
              </div>
              <div className="flex items-center justify-center my-4">
                <div className="bg-green-100 rounded-full p-2">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h2 className="text-center text-xl font-semibold text-gray-600 mb-2">
                You're on the waitlist!
              </h2>
             
              {queueStatus && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Customers waiting</span>
                    <span className="font-semibold text-gray-900">{queueStatus.waitingCount}</span>
                  </div>
                </div>
              )}
            </>
          )}

          <button
            onClick={handleViewWaitlist}
            className="mt-4 w-full bg-cuspurple text-white py-2 rounded-lg shadow-md hover:scale-105"
          >
            View Waitlist
          </button>

          <button
            onClick={handleExitWaitlist}
            className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg shadow-md hover:scale-105"
          >
            Exit Waitlist
          </button>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="mb-4">Are you sure you want to exit the waitlist?</p>
            <button
              onClick={confirmExit}
              className="bg-red-500 text-white py-2 px-4 rounded-lg mr-2 hover:scale-105"
            >
              Yes
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="bg-gray-300 text-gray-900 py-2 px-4 rounded-lg hover:scale-105"
            >
              No
            </button>
          </div>
        </div>
      )}
      <footer className="mt-4 text-center text-gray-600">
        Powered by <a href="https://getnivo.tech" target="_blank" rel="noopener noreferrer" className="text-cuspurple">Nivo</a>
      </footer>
    </div>
  );
};

export default WaitlistConfirmation;