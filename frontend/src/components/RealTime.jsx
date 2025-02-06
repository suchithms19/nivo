import React, { useState, useEffect } from 'react';

const RealTimeWaitTime = ({ entryTime }) => {
  const [waitTime, setWaitTime] = useState('');

  useEffect(() => {
    const updateWaitTime = () => {
      const now = new Date();
      const entry = new Date(entryTime);
      const diff = now - entry;

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      let timeString = '';
      if (hours > 0) timeString += `${hours}h `;
      if (minutes > 0 || hours > 0) timeString += `${minutes}m `;
      timeString += `${seconds}s`;

      setWaitTime(timeString.trim());
    };

    updateWaitTime(); // Initial call
    const intervalId = setInterval(updateWaitTime, 1000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [entryTime]);

  return <span>{waitTime}</span>;
};

export default RealTimeWaitTime;