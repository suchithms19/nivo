import React from 'react';
import TimeDifference from "./TimeDifference";

const AllPatientRow = ({ patient }) => {
  const formatDateTime = (isoTimestamp) => {
    const date = new Date(isoTimestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="flex items-center py-3 px-4 hover:bg-gray-50 transition-colors duration-150">
      {/* Name and Tags Column */}
      <div className="w-1/4 pr-8">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 capitalize">{patient.name}</span>
          {patient.selfRegistered && (
            <span className="text-xs text-cuspurple bg-purple-50 px-2 py-0.5 rounded-full">
              Self-Reg
            </span>
          )}
          {patient.selfCanceled && (
            <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
              Self-Can
            </span>
          )}
        </div>
      </div>

      {/* Phone Number */}
      <div className="w-1/5 pr-8 text-gray-600">
        +91 {patient.phoneNumber}
      </div>

      {/* Age */}
      <div className="w-1/12 pr-8 text-gray-600">
        {patient.age || 'N/A'}
      </div>

      {/* Entry Time */}
      <div className="w-1/5 pr-8 text-gray-600">
        {formatDateTime(patient.entryTime)}
      </div>

      {/* Time Waited/Status */}
      <div className="w-1/5">
        {patient.canceled ? (
          <span className="text-sm px-3 py-1 rounded-full inline-block bg-red-50 text-red-500 ">Cancelled</span>
        ) : (
          <div className={`text-sm px-3 py-1 rounded-full inline-block ${
            patient.postConsultation 
              ? 'bg-green-50 text-green-600' 
              : 'bg-blue-50 text-blue-600'
          }`}>
            {patient.postConsultation ? (
              <TimeDifference entryTime={patient.entryTime} exitTime={patient.postConsultation} />
            ) : (
              'In Progress'
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllPatientRow;

