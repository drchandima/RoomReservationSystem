import React, { useState, useMemo } from 'react';
import { Room, Booking } from '../types';
import Modal from './Modal';
import Calendar from './Calendar';
import BookingForm from './BookingForm';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room;
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'userId' | 'status'>) => void;
}

// Helper to create a date object in local timezone from a YYYY-MM-DD string
const parseDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
};

const calculateNights = (from: Date | null, to: Date | null): number => {
    if (!from || !to || from >= to) return 0;
    const diffTime = to.getTime() - from.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
};


const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, room, bookings, addBooking }) => {
  const [selectedRange, setSelectedRange] = useState<{from: Date | null, to: Date | null}>({ from: null, to: null });
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const handleBooking = (userName: string, userEmail: string) => {
    if (!selectedRange.from || !selectedRange.to) return;

    addBooking({
      roomId: room.id,
      checkInDate: selectedRange.from.toISOString().split('T')[0],
      checkOutDate: selectedRange.to.toISOString().split('T')[0],
      userName,
      userEmail,
    });
    setBookingConfirmed(true);
  };
  
  const handleClose = () => {
    setBookingConfirmed(false);
    setSelectedRange({ from: null, to: null });
    onClose();
  }

  const nights = calculateNights(selectedRange.from, selectedRange.to);
  const totalPrice = nights * room.price;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Book: ${room.name}`}>
      {bookingConfirmed ? (
        <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
            </div>
          <h3 className="text-2xl font-bold text-gray-800 mt-4">Booking Confirmed!</h3>
          <p className="text-gray-600 mt-2">
            Your reservation for {room.name} from {selectedRange.from?.toLocaleDateString()} to {selectedRange.to?.toLocaleDateString()} is confirmed.
          </p>
          <div className="mt-4 text-gray-800 bg-gray-100 p-3 rounded-lg">
            Check-in is at 2:00 PM. Check-out is at 12:00 PM.
          </div>
          <button onClick={handleClose} className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            Close
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-lg text-gray-700 mb-2">1. Select Check-in and Check-out Dates</h4>
            <Calendar 
              selectedRange={selectedRange} 
              setSelectedRange={setSelectedRange} 
              bookings={bookings}
              roomId={room.id}
            />
          </div>

          {nights > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="font-semibold text-lg text-blue-800">Your Stay</p>
              <p className="text-gray-600">
                {selectedRange.from?.toLocaleDateString()} - {selectedRange.to?.toLocaleDateString()}
              </p>
              <p className="mt-2 text-xl font-bold text-gray-900">
                Total: ${totalPrice.toFixed(2)}
                <span className="text-base font-normal text-gray-600"> for {nights} {nights === 1 ? 'night' : 'nights'}</span>
              </p>
            </div>
          )}
          
          {selectedRange.from && selectedRange.to && (
            <div>
                <h4 className="font-semibold text-lg text-gray-700 mb-2">2. Your Details</h4>
                <BookingForm onBook={handleBooking} />
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default BookingModal;