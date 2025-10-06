import React, { useState, useMemo, useEffect } from 'react';
import { Room, Booking } from '../types';
import Modal from './Modal';
import Calendar from './Calendar';

interface EditBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  room: Room;
  allBookings: Booking[];
  onSave: (booking: Booking) => void;
}

// Helper to create a date object in local timezone from a YYYY-MM-DD string
const parseDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
};

const EditBookingModal: React.FC<EditBookingModalProps> = ({ isOpen, onClose, booking, room, allBookings, onSave }) => {
  const [selectedRange, setSelectedRange] = useState<{from: Date | null, to: Date | null}>({ from: null, to: null });

  useEffect(() => {
    if (booking) {
        setSelectedRange({
            from: parseDate(booking.checkInDate),
            to: parseDate(booking.checkOutDate)
        });
    }
  }, [booking]);

  // Exclude the current booking from availability checks so the user can see/re-select their original slot
  const otherBookings = useMemo(() => allBookings.filter(b => b.id !== booking.id), [allBookings, booking.id]);

  const handleSaveChanges = () => {
    if (!selectedRange.from || !selectedRange.to) return;

    const updatedBooking: Booking = {
      ...booking,
      checkInDate: selectedRange.from.toISOString().split('T')[0],
      checkOutDate: selectedRange.to.toISOString().split('T')[0],
    };
    
    onSave(updatedBooking);
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Booking: ${room.name}`}>
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-lg text-gray-700 mb-2">1. Select New Check-in and Check-out Dates</h4>
          <Calendar
            selectedRange={selectedRange}
            setSelectedRange={setSelectedRange}
            bookings={otherBookings} // Use filtered bookings for availability check
            roomId={room.id}
          />
        </div>
        
        <div className="pt-4 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-300">
                Cancel
            </button>
            <button 
              type="button" 
              onClick={handleSaveChanges} 
              className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-blue-300"
              disabled={!selectedRange.from || !selectedRange.to}
            >
                Save Changes
            </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditBookingModal;