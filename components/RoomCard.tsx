import React, { useState } from 'react';
import { Room, Booking } from '../types';
import Icon from './Icon';
import BookingModal from './BookingModal';

interface RoomCardProps {
  room: Room;
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'userId' | 'status'>) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, bookings, addBooking }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
        <img src={room.imageUrl} alt={room.name} className="w-full h-48 object-cover" />
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{room.name}</h3>
          
          <div className="flex items-center text-gray-600 mb-4 space-x-6">
            <div className="flex items-center">
              <Icon name="Users" className="w-5 h-5 mr-2" />
              <span>{room.capacity} people</span>
            </div>
            <div className="flex items-center">
              <Icon name="DollarSign" className="w-5 h-5 mr-2 text-green-600" />
              <span className="font-semibold">${room.price}/day</span>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold text-gray-700 mb-2">Amenities:</h4>
            <div className="flex flex-wrap gap-2">
              {room.amenities.map(amenity => (
                <div key={amenity.name} className="flex items-center bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                  <Icon name={amenity.icon} className="w-4 h-4 mr-2" />
                  <span>{amenity.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Book Now
          </button>
        </div>
      </div>
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        room={room}
        bookings={bookings}
        addBooking={addBooking}
      />
    </>
  );
};

export default RoomCard;