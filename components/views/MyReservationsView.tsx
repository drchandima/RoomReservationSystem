import React, { useState } from 'react';
import { Booking, Room } from '../../types';
import Icon from '../Icon';
import EditBookingModal from '../EditBookingModal';

interface MyReservationsViewProps {
  userBookings: Booking[];
  allBookings: Booking[];
  rooms: Room[];
  cancelBooking: (bookingId: string) => void;
  updateBooking: (booking: Booking) => void;
}

const MyReservationsView: React.FC<MyReservationsViewProps> = ({ userBookings, allBookings, rooms, cancelBooking, updateBooking }) => {
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  const getRoom = (roomId: string) => {
    return rooms.find(r => r.id === roomId);
  };
  
  const getRoomName = (roomId: string) => {
    return getRoom(roomId)?.name || 'Unknown Room';
  };

  const handleSaveBooking = (updatedBooking: Booking) => {
    updateBooking(updatedBooking);
    setEditingBooking(null);
  }

  const formatDate = (dateString: string) => {
    // Adding T00:00:00 ensures the date is parsed in the local timezone
    return new Date(dateString + 'T00:00:00').toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Reservations</h1>
        <p className="text-lg text-gray-600 mb-8">Here are your upcoming bookings. You can edit or delete them if your plans change.</p>
        
        {userBookings.length === 0 ? (
            <div className="text-center bg-white p-12 rounded-lg shadow-md">
                <Icon name="Calendar" className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-xl font-medium text-gray-900">No Reservations Found</h3>
                <p className="mt-1 text-gray-500">You haven't booked any rooms yet.</p>
            </div>
        ) : (
            <div className="space-y-4">
            {userBookings.sort((a,b) => new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime()).map(booking => (
                <div key={booking.id} className="bg-white p-6 rounded-lg shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-grow">
                    <h3 className="text-xl font-bold text-blue-700">{getRoomName(booking.roomId)}</h3>
                    <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:space-x-6 text-gray-600">
                        <div className="flex items-center">
                            <Icon name="Calendar" className="w-5 h-5 mr-2" />
                            <span>{formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}</span>
                        </div>
                    </div>
                     <div className="mt-2 text-sm text-gray-500 bg-gray-100 p-2 rounded-md inline-block">
                        Check-in: 2:00 PM | Check-out: 12:00 PM
                    </div>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0 w-full sm:w-auto">
                    <button
                        onClick={() => setEditingBooking(booking)}
                        className="flex-1 sm:flex-initial bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => window.confirm('Are you sure you want to delete this reservation?') && cancelBooking(booking.id)}
                        className="flex-1 sm:flex-initial bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-200"
                    >
                        Delete
                    </button>
                </div>
                </div>
            ))}
            </div>
        )}
        {editingBooking && (
            <EditBookingModal
                isOpen={!!editingBooking}
                onClose={() => setEditingBooking(null)}
                booking={editingBooking}
                room={getRoom(editingBooking.roomId)!}
                allBookings={allBookings}
                onSave={handleSaveBooking}
            />
        )}
    </div>
  );
};

export default MyReservationsView;