import React from 'react';
import { Clock } from 'lucide-react';

const ComingSoon = ({ title = 'Coming Soon', description = 'This feature is under development.' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
        <div className="flex justify-center mb-4">
          <Clock size={48} style={{color: "#605BFF"}} />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-800">{title}</h2>
        <p className="text-gray-600">{description}</p>
        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
            <div style={{ backgroundColor: "#605BFF"}} className="h-2.5 rounded-full w-3/4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;