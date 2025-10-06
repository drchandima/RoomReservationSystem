import React, { useMemo } from 'react';
import { Booking } from '../types';
import { TIME_SLOTS } from '../constants';
import Icon from './Icon';

interface TimeSlotPickerProps {
  roomId: string;
  date: string; // YYYY-MM-DD
  bookings: Booking[];
  selectedSlot: string | null;
  setSelectedSlot: (slot: string) => void;
}

// FIX: This component was using properties on the Booking type that did not exist (e.g., date, startTime, endTime).
// The logic has been updated to be compatible with the existing multi-day booking model.
// Now, if a room is booked for any part of a day, all time slots for that day are considered booked.

const parseDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
};

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({ roomId, date, bookings, selectedSlot, setSelectedSlot }) => {
  const isDateBooked = useMemo(() => {
    const targetDate = parseDate(date);
    // Set time to 0 to compare dates only
    targetDate.setHours(0, 0, 0, 0);

    return bookings.some(booking => {
        if (booking.roomId !== roomId) {
            return false;
        }
        
        const checkIn = parseDate(booking.checkInDate);
        const checkOut = parseDate(booking.checkOutDate);
        
        // The range is [checkIn, checkOut). Check if targetDate is within this range.
        return targetDate >= checkIn && targetDate < checkOut;
    });
  }, [date, bookings, roomId]);

  return (
    <div className="bg-white p-4 rounded-lg border">
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {TIME_SLOTS.map(slot => {
          const isBooked = isDateBooked;
          const isSelected = selectedSlot === `${slot} - ${parseInt(slot.split(':')[0]) + 1}:00`;

          const baseClasses = "w-full text-center p-3 rounded-lg border transition-all duration-200 flex items-center justify-center font-medium";
          let slotClasses = `${baseClasses} `;
          if (isBooked) {
              slotClasses += "bg-gray-200 text-gray-400 cursor-not-allowed line-through";
          } else if (isSelected) {
              slotClasses += "bg-blue-600 text-white border-blue-700 shadow-md transform scale-105";
          } else {
              slotClasses += "bg-white text-blue-600 border-gray-300 hover:bg-blue-50 hover:border-blue-400 cursor-pointer";
          }

          return (
            <button
              key={slot}
              disabled={isBooked}
              onClick={() => setSelectedSlot(`${slot} - ${parseInt(slot.split(':')[0]) + 1}:00`)}
              className={slotClasses}
            >
              <Icon name="Clock" className="w-4 h-4 mr-2" />
              {slot}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSlotPicker;
