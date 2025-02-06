import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWaitlist } from '../hooks';
import axios from 'axios';
import BACKEND_URL from '../config';

const ViewWaitlist = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { waitlist, loading, error } = useWaitlist(userId);
  const [doctorName, setDoctorName] = useState('');

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

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Waitlist</h1>
          <button
            onClick={handleBack}
            className="bg-cuspurple text-white py-2 px-4 rounded-lg shadow-md hover:scale-1050"
          >
            Back
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className='flex items-center justify-center mb-4'> 
            <span className="font-semibold text-xl text-gray-900 text-center capitalize">{doctorName}</span>
          </div>
          {loading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-600">Error fetching waitlist.</p>
          ) : waitlist.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {waitlist.map((entry, index) => (
                <li key={entry._id} className="py-4 flex items-center justify-between">
                  <span className="text-gray-900">{index + 1}. {entry.patient.name}</span>
                  <span className="text-gray-600 text-sm">{new Date(entry.createdAt).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-600">No customers are currently waiting.</p>
          )}
        </div>
      </div>
      <footer className="mt-4 text-center text-gray-600">
        Powered by <a href="https://getnivo.tech" target="_blank" rel="noopener noreferrer" className="text-cuspurple">Nivo</a>
      </footer>
    </div>
  );
};

export default ViewWaitlist;
