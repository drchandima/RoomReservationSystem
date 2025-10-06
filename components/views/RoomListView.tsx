import React from 'react';
import { Room, Booking } from '../../types';
import RoomCard from '../RoomCard';

interface RoomListViewProps {
  rooms: Room[];
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'userId' | 'status'>) => void;
}

const RoomListView: React.FC<RoomListViewProps> = ({ rooms, bookings, addBooking }) => {
  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Available Rooms</h1>
            <p className="mt-2 text-lg text-gray-600">Select a room to start your booking process.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rooms.map(room => (
            <RoomCard
            key={room.id}
            room={room}
            bookings={bookings}
            addBooking={addBooking}
            />
        ))}
        </div>
    </div>
  );
};

export default RoomListView;
