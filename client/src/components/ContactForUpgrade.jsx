import React from 'react';
import { Star, Mail, Phone } from 'lucide-react';

const ContactForUpgrade = ({ 
  title = 'Upgrade Your Experience', 
  description = 'Contact us to unlock premium features and take your experience to the next level.',
  email = 'mssuchith@email.com',
  phone = '+(91) 9019526435'
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
        <div className="flex justify-center mb-4">
          <Star size={48} className="text-yellow-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-800">{title}</h2>
        <p className="text-gray-600 mb-6">{description}</p>
        <div className="space-y-4">
          <div style={{color: "#605BFF"}} className="flex items-center justify-center space-x-2">
            <Mail size={20} />
            <a href={`mailto:${email}`} className="hover:underline">{email}</a>
          </div>
          <div style={{color: "#605BFF"}} className="flex items-center justify-center space-x-2">
            <Phone size={20} />
            <a href={`tel:${phone}`} className="hover:underline">{phone}</a>
          </div>
        </div>
        <a href={`mailto:${email}`}><button style={{backgroundColor: "#605BFF"}} className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:scale-105">
          Request Upgrade
        </button></a>
      </div>
    </div>
  );
};

export default ContactForUpgrade;