import React from 'react';

const TimeDifference = ({ entryTime, exitTime }) => {
  const calculateTimeDiff = () => {
    const entry = new Date(entryTime);
    const exit = new Date(exitTime);
    const diffInMs = exit - entry;

    const totalSeconds = Math.floor(diffInMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;

    // If the difference is more than 1 hour, return hours and minutes
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    // Otherwise, return minutes and seconds
    return `${minutes}m ${seconds}s`;
  };

  // Check if entryTime or exitTime is missing or undefined
  if (!entryTime || !exitTime) {
    return <div style={{ color: 'green' }}>Waiting</div>;
  }

  const timeDiff = calculateTimeDiff();

  return (
    <div>
      {timeDiff}
    </div>
  );
};

export default TimeDifference;
