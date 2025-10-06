import React from 'react';
import { Booking, Room } from '../../types';
import Icon from '../Icon';

interface MyReservationsViewProps {
  bookings: Booking[];
  rooms: Room[];
  cancelBooking: (bookingId: string) => void;
}

const MyReservationsView: React.FC<MyReservationsViewProps> = ({ bookings, rooms, cancelBooking }) => {
  const getRoomName = (roomId: string) => {
    return rooms.find(r => r.id === roomId)?.name || 'Unknown Room';
  };

  return (
    <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Reservations</h1>
        <p className="text-lg text-gray-600 mb-8">Here are your upcoming bookings. You can cancel them if your plans change.</p>
        
        {bookings.length === 0 ? (
            <div className="text-center bg-white p-12 rounded-lg shadow-md">
                <Icon name="Calendar" className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-xl font-medium text-gray-900">No Reservations Found</h3>
                <p className="mt-1 text-gray-500">You haven't booked any rooms yet.</p>
            </div>
        ) : (
            <div className="space-y-4">
            {bookings.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(booking => (
                <div key={booking.id} className="bg-white p-6 rounded-lg shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-xl font-bold text-blue-700">{getRoomName(booking.roomId)}</h3>
                    <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:space-x-6 text-gray-600">
                        <div className="flex items-center">
                            <Icon name="Calendar" className="w-5 h-5 mr-2" />
                            <span>{new Date(booking.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center mt-2 sm:mt-0">
                            <Icon name="Clock" className="w-5 h-5 mr-2" />
                            <span>{booking.startTime} - {booking.endTime}</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => window.confirm('Are you sure you want to cancel this reservation?') && cancelBooking(booking.id)}
                    className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-200 w-full sm:w-auto"
                >
                    Cancel
                </button>
                </div>
            ))}
            </div>
        )}
    </div>
  );
};

export default MyReservationsView;
