import React from 'react';
import { NavLink } from 'react-router-dom';

const ButtonSide = ({ label, route, badge }) => {
  return (
    <NavLink
      to={route}
      className={({ isActive }) =>
        isActive
          ? 'flex items-center p-2 text-blue-600 bg-blue-100 w-full'
          : 'flex items-center p-2 text-gray-700 hover:bg-gray-100 w-full'
      }
    >
      <span>{label}</span>
      {badge && <span className="ml-auto bg-red-500 text-white rounded-full px-2 text-sm">{badge}</span>}
    </NavLink>
  );
};

export default ButtonSide;
