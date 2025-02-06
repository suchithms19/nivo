import React from 'react';
import PatientRow from './PatientRow';
import BookingRow from './BookingRow';
import { getWaitlist, getServelist, getTodayBookings } from '../hooks';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';

const PatientList = () => {
  const { data, loading, error } = getWaitlist();
  const { datas, loadings, errors } = getServelist();
  const { bookings, loadingBookings, errorBookings } = getTodayBookings();
  const navigate = useNavigate();

  function onClick() {
    navigate('/addcustomer');
  }

  function onBookingClick() {
    navigate('/add-booking');
  }

  return (
    <div className="bg-gray-100 min-h-screen h-max">
      <div className="max-w-7xl mx-auto overflow-x-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Today's Bookings Section */}
          <div className="bg-white rounded-lg shadow-sm mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">Today's Bookings</h2>
                  <div className="text-sm text-gray-500 mt-1">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {`${bookings.length} bookings`}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={onBookingClick}
                  className="bg-cuspurple text-white px-4 py-2 rounded-md hover:scale-105 transition duration-150 ease-in-out flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Add Booking
                </button>
              </div>
            </div>
            <div className="px-6">
              {bookings.map((booking) => (
                <BookingRow key={booking._id} booking={booking} />
              ))}
              {bookings.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  No bookings for today
                </div>
              )}
            </div>
          </div>

          {/* Waitlist Section */}
          <div className="bg-white rounded-lg shadow-sm mb-8 flex-1">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">Waitlist</h2>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <span className="flex items-center mr-4">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                      </svg>
                      {`${data.length} persons`}
                    </span>
                  </div>
                </div>
                <button onClick={onClick} style={{ backgroundColor: "#605BFF"}} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:scale-105 transition duration-150 ease-in-out">
                  + Add Customer
                </button>
              </div>
            </div>
            <div className="px-6">
              
              
              { (
                data.map((item) => (
                  <PatientRow key={item._id} patient={item.patient} section="waitlist" />
                ))
              )}
            </div>
          </div>

          {/* Serving Section */}
          <div className="bg-white rounded-lg shadow-sm mb-8 flex-1">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Serving</h2>
              <div className="text-sm text-gray-500 mt-1">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                  { `${datas.length} persons`}
                </span>
              </div>
            </div>
            <div className="px-6">
              
              
              { (
                datas.map((item) => (
                  <PatientRow key={item._id} patient={item.patient} section="serving" />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientList;
