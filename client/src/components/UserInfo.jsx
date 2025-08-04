import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BACKEND_URL from '../config';
import { QRCodeSVG } from 'qrcode.react';
import ReactDOM from 'react-dom';
import { Copy, Clock, Save } from 'lucide-react';

const UserInfo = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [copiedLink, setCopiedLink] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [businessHours, setBusinessHours] = useState({
    startHour: 9,
    startMinute: 0,
    endHour: 17,
    endMinute: 0,
    sundayOpen: false,
    saturdayOpen: false
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/user/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUser(response.data);
        setBusinessHours(response.data.businessHours);
      } catch (err) {
        setError('Failed to fetch user information');
      }
    };

    fetchUserInfo();
  }, []);

  const copyToClipboard = (text, linkType) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedLink(linkType);
      setTimeout(() => setCopiedLink(''), 2000); // Reset after 2 seconds
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  };

  const downloadQR = (value, filename) => {
    const qrContainer = document.createElement('div');
    ReactDOM.render(
      <QRCodeSVG 
        value={value}
        size={600}
        level="H"
        includeMargin={true}
      />,
      qrContainer
    );

    const svg = qrContainer.querySelector('svg');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const DOMURL = window.URL || window.webkitURL || window;
    const url = DOMURL.createObjectURL(svgBlob);
    
    const img = new Image();
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      DOMURL.revokeObjectURL(url);
      
      canvas.toBlob((blob) => {
        const pngUrl = DOMURL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.download = filename;
        downloadLink.href = pngUrl;
        downloadLink.click();
        DOMURL.revokeObjectURL(pngUrl);
      }, 'image/png', 1.0);
    };
    
    img.src = url;
  };

  const handleBusinessHoursUpdate = async () => {
    try {
      const response = await axios.put(
        `${BACKEND_URL}/api/v1/user/update-business-hours`,
        { businessHours },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      
      if (response.status === 200) {
        setSuccessMessage('Business hours updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000); // Clear message after 3 seconds
      }
    } catch (err) {
      setError('Failed to update business hours');
      setTimeout(() => setError(''), 3000);
    }
  };

  const renderBusinessHoursSettings = () => {
    return (
      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Clock size={20} />
          Business Hours Settings
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Opening Time</label>
            <div className="flex gap-2">
              <select
                value={businessHours.startHour}
                onChange={(e) => setBusinessHours({
                  ...businessHours,
                  startHour: parseInt(e.target.value)
                })}
                className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
                {[...Array(24)].map((_, i) => (
                  <option key={i} value={i}>{i.toString().padStart(2, '0')}:00</option>
                ))}
              </select>
              <select
                value={businessHours.startMinute}
                onChange={(e) => setBusinessHours({
                  ...businessHours,
                  startMinute: parseInt(e.target.value)
                })}
                className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
                {[0, 30].map((minute) => (
                  <option key={minute} value={minute}>{minute.toString().padStart(2, '0')}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Closing Time</label>
            <div className="flex gap-2">
              <select
                value={businessHours.endHour}
                onChange={(e) => setBusinessHours({
                  ...businessHours,
                  endHour: parseInt(e.target.value)
                })}
                className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
                {[...Array(24)].map((_, i) => (
                  <option key={i} value={i}>{i.toString().padStart(2, '0')}:00</option>
                ))}
              </select>
              <select
                value={businessHours.endMinute}
                onChange={(e) => setBusinessHours({
                  ...businessHours,
                  endMinute: parseInt(e.target.value)
                })}
                className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
                {[0, 30].map((minute) => (
                  <option key={minute} value={minute}>{minute.toString().padStart(2, '0')}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-6 mt-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={businessHours.saturdayOpen}
              onChange={(e) => setBusinessHours({
                ...businessHours,
                saturdayOpen: e.target.checked
              })}
              className="rounded text-purple-600 focus:ring-purple-500"
            />
            <span className="text-sm text-gray-700">Open on Saturday</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={businessHours.sundayOpen}
              onChange={(e) => setBusinessHours({
                ...businessHours,
                sundayOpen: e.target.checked
              })}
              className="rounded text-purple-600 focus:ring-purple-500"
            />
            <span className="text-sm text-gray-700">Open on Sunday</span>
          </label>
        </div>

        <button
          onClick={handleBusinessHoursUpdate}
          className="mt-4 flex items-center gap-2 bg-cuspurple text-white px-4 py-2 rounded-md hover:scale-105 transition-transform"
        >
          <Save size={16} />
          Save Business Hours
        </button>

        {successMessage && (
          <div className="mt-2 text-green-600 text-sm">
            {successMessage}
          </div>
        )}
      </div>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading settings...</div>
      </div>
    );
  }

  const waitlistUrl = `getnivo.tech/selfadd/${user.businessNameForUrl}`;
  const bookingUrl = `getnivo.tech/book/${user.businessNameForUrl}`;
  const viewWaitlistUrl = `getnivo.tech/view-waitlist/${user._id}`;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Account Information</h2>
        
        <div className="space-y-4">
          {/* Basic Info Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-700 capitalize"><strong>Business Name:</strong> {user.businessName}</p>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-3 gap-6">
            {/* Waitlist Link */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <h3 className="font-semibold text-lg">Waitlist Registration</h3>
              <div className="flex items-center justify-between bg-white p-3 rounded-md">
                <p className="text-gray-700 truncate">{waitlistUrl}</p>
                <button 
                  onClick={() => copyToClipboard(waitlistUrl, 'waitlist')} 
                  className="flex items-center gap-2 text-white bg-cuspurple hover:scale-105 rounded-md px-3 py-1.5"
                >
                  <Copy size={16} />
                  {copiedLink === 'waitlist' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="flex justify-center">
                <div className="p-3 bg-white rounded-lg">
                  <QRCodeSVG value={`https://${waitlistUrl}`} size={120} />
                  <button 
                    onClick={() => downloadQR(`https://${waitlistUrl}`, `${user.businessName}-waitlist-qr.png`)}
                    className="mt-2 w-full text-cuspurple hover:bg-purple-50 border border-cuspurple rounded-md px-3 py-1 text-sm"
                  >
                    Download QR
                  </button>
                </div>
              </div>
            </div>

            {/* Booking Link */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <h3 className="font-semibold text-lg">Appointment Booking</h3>
              <div className="flex items-center justify-between bg-white p-3 rounded-md">
                <p className="text-gray-700 truncate">{bookingUrl}</p>
                <button 
                  onClick={() => copyToClipboard(bookingUrl, 'booking')} 
                  className="flex items-center gap-2 text-white bg-cuspurple hover:scale-105 rounded-md px-3 py-1.5"
                >
                  <Copy size={16} />
                  {copiedLink === 'booking' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="flex justify-center">
                <div className="p-3 bg-white rounded-lg">
                  <QRCodeSVG value={`https://${bookingUrl}`} size={120} />
                  <button 
                    onClick={() => downloadQR(`https://${bookingUrl}`, `${user.businessName}-booking-qr.png`)}
                    className="mt-2 w-full text-cuspurple hover:bg-purple-50 border border-cuspurple rounded-md px-3 py-1 text-sm"
                  >
                    Download QR
                  </button>
                </div>
              </div>
            </div>

            {/* View Waitlist Link */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <h3 className="font-semibold text-lg">Public Waitlist View</h3>
              <div className="flex items-center justify-between bg-white p-3 rounded-md">
                <p className="text-gray-700 truncate">{viewWaitlistUrl}</p>
                <button 
                  onClick={() => copyToClipboard(viewWaitlistUrl, 'view')} 
                  className="flex items-center gap-2 text-white bg-cuspurple hover:scale-105 rounded-md px-3 py-1.5"
                >
                  <Copy size={16} />
                  {copiedLink === 'view' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="flex justify-center">
                <div className="p-3 bg-white rounded-lg">
                  <QRCodeSVG value={`https://${viewWaitlistUrl}`} size={120} />
                  <button 
                    onClick={() => downloadQR(`https://${viewWaitlistUrl}`, `${user.businessName}-view-qr.png`)}
                    className="mt-2 w-full text-cuspurple hover:bg-purple-50 border border-cuspurple rounded-md px-3 py-1 text-sm"
                  >
                    Download QR
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Business Hours Settings - Now below QR codes */}
          {renderBusinessHoursSettings()}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
