import React from 'react';
import { View } from '../types';
import Icon from './Icon';

interface HeaderProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  isAdmin: boolean;
  toggleRole: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView, isAdmin, toggleRole }) => {
  const NavLink: React.FC<{ view: View; text: string }> = ({ view, text }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
        currentView === view
          ? 'bg-blue-600 text-white'
          : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
      }`}
    >
      {text}
    </button>
  );

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center text-blue-600">
               <Icon name="Calendar" className="h-8 w-8" />
               <span className="ml-2 text-xl font-bold text-gray-800">Roomify</span>
            </div>
            {!isAdmin && (
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <NavLink view="Browse" text="Browse Rooms" />
                  <NavLink view="MyReservations" text="My Reservations" />
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center">
             <span className="text-sm font-medium text-gray-500 mr-3">{isAdmin ? 'Admin View' : 'User View'}</span>
            <button
              onClick={toggleRole}
              className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              style={{ backgroundColor: isAdmin ? '#3B82F6' : '#D1D5DB' }}
            >
              <span
                className="inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ease-in-out"
                style={{ transform: isAdmin ? 'translateX(22px)' : 'translateX(2px)' }}
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
