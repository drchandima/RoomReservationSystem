import React from 'react';
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

const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};


const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({ roomId, date, bookings, selectedSlot, setSelectedSlot }) => {
  const relevantBookings = bookings.filter(b => b.roomId === roomId && b.date === date);

  return (
    <div className="bg-white p-4 rounded-lg border">
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {TIME_SLOTS.map(slot => {
          const slotStartMinutes = timeToMinutes(slot);
          const slotEndMinutes = slotStartMinutes + 60; // Assuming 1-hour slots

          const isBooked = relevantBookings.some(booking => {
            const bookingStartMinutes = timeToMinutes(booking.startTime);
            const bookingEndMinutes = timeToMinutes(booking.endTime);
            // Check for overlap: (StartA < EndB) and (EndA > StartB)
            return slotStartMinutes < bookingEndMinutes && slotEndMinutes > bookingStartMinutes;
          });

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
