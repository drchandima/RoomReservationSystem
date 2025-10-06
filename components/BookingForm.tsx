import React, { useState } from 'react';

interface BookingFormProps {
  onBook: (userName: string, userEmail: string) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onBook }) => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim()) {
      setError('Please fill in both name and email.');
      return;
    }
    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(userEmail)) {
        setError('Please enter a valid email address.');
        return;
    }
    setError('');
    onBook(userName, userEmail);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="userName" className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          type="text"
          id="userName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="John Doe"
        />
      </div>
      <div>
        <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700">Email Address</label>
        <input
          type="email"
          id="userEmail"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="you@example.com"
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
      >
        Confirm Booking
      </button>
    </form>
  );
};

export default BookingForm;
