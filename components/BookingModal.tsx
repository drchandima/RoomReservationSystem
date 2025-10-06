import React, { useState, useMemo } from 'react';
import { Room, Booking } from '../types';
import Modal from './Modal';
import Calendar from './Calendar';
import TimeSlotPicker from './TimeSlotPicker';
import BookingForm from './BookingForm';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room;
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'userId' | 'status'>) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, room, bookings, addBooking }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const formattedDate = useMemo(() => selectedDate.toISOString().split('T')[0], [selectedDate]);

  const handleBooking = (userName: string, userEmail: string) => {
    if (!selectedSlot) return;

    const [startTime] = selectedSlot.split(' - ');
    const endTime = `${parseInt(startTime.split(':')[0]) + 1}:00`;

    addBooking({
      roomId: room.id,
      date: formattedDate,
      startTime,
      endTime,
      userName,
      userEmail,
    });
    setBookingConfirmed(true);
  };
  
  const handleClose = () => {
    setBookingConfirmed(false);
    setSelectedSlot(null);
    onClose();
  }

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
          <p className="text-gray-600 mt-2">Your reservation for {room.name} on {selectedDate.toLocaleDateString()} at {selectedSlot} is confirmed.</p>
          <button onClick={handleClose} className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            Close
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-lg text-gray-700 mb-2">1. Select Date</h4>
            <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
          </div>

          <div>
            <h4 className="font-semibold text-lg text-gray-700 mb-2">2. Select Time Slot</h4>
            <TimeSlotPicker
              roomId={room.id}
              date={formattedDate}
              bookings={bookings}
              selectedSlot={selectedSlot}
              setSelectedSlot={setSelectedSlot}
            />
          </div>
          
          {selectedSlot && (
            <div>
                <h4 className="font-semibold text-lg text-gray-700 mb-2">3. Your Details</h4>
                <BookingForm onBook={handleBooking} />
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default BookingModal;
