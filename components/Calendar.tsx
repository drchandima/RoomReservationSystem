import React, { useState, useMemo } from 'react';
import Icon from './Icon';
import { Booking } from '../types';

interface CalendarProps {
  selectedRange: { from: Date | null; to: Date | null };
  setSelectedRange: (range: { from: Date | null; to: Date | null }) => void;
  bookings: Booking[];
  roomId: string;
}

const parseDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
};

const Calendar: React.FC<CalendarProps> = ({ selectedRange, setSelectedRange, bookings, roomId }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const bookedDates = useMemo(() => {
    const dates = new Set<string>();
    bookings
      .filter(b => b.roomId === roomId)
      .forEach(booking => {
        let current = parseDate(booking.checkInDate);
        const end = parseDate(booking.checkOutDate);
        while (current < end) {
          dates.add(current.toDateString());
          current.setDate(current.getDate() + 1);
        }
      });
    return dates;
  }, [bookings, roomId]);

  const isDayBlocked = (day: Date) => bookedDates.has(day.toDateString());

  const handleDateClick = (day: Date) => {
    if (isDayBlocked(day)) return;

    const { from, to } = selectedRange;
    if (!from || (from && to)) {
        setSelectedRange({ from: day, to: null });
        setHoveredDate(null);
    } else {
        if (day < from) {
            setSelectedRange({ from: day, to: null });
        } else {
            let tempFrom = new Date(from);
            let blockedInRange = false;
            while(tempFrom <= day) {
                if (isDayBlocked(tempFrom)) {
                    blockedInRange = true;
                    break;
                }
                tempFrom.setDate(tempFrom.getDate() + 1);
            }

            if (blockedInRange) {
                 setSelectedRange({ from: day, to: null });
            } else {
                 setSelectedRange({ from, to: day });
            }
            setHoveredDate(null);
        }
    }
  };

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const renderDays = () => {
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isPast = date < today;
      const isBlocked = isDayBlocked(date);

      const { from, to } = selectedRange;
      const isFrom = from && date.toDateString() === from.toDateString();
      const isTo = to && date.toDateString() === to.toDateString();
      const isInRange = from && to && date > from && date < to;
      const isInHoverRange = from && !to && hoveredDate && date > from && date <= hoveredDate;

      const baseClasses = "w-10 h-10 flex items-center justify-center transition-colors duration-200";
      let dayClasses = `${baseClasses} `;
      let containerClasses = "relative";

      if(isFrom || isTo) {
          dayClasses += "bg-blue-600 text-white font-bold rounded-full";
      } else if (isInRange || isInHoverRange) {
          dayClasses += "bg-blue-100 text-blue-800 rounded-none";
      } else if (isPast || isBlocked) {
          dayClasses += "text-gray-400 cursor-not-allowed line-through";
      } else {
          dayClasses += "text-gray-700 hover:bg-gray-200 cursor-pointer rounded-full";
      }

      if(from && !to && hoveredDate && hoveredDate < from && date <= from && date >= hoveredDate) {
          dayClasses = `${baseClasses} bg-red-100 text-red-800 rounded-none`
      }

      days.push(
        <div key={day} 
          className={`flex justify-center items-center ${isInRange || isInHoverRange ? 'bg-blue-100' : ''} 
          ${isFrom || (from && !to && date.toDateString() === from.toDateString()) ? 'rounded-l-full' : ''} 
          ${isTo || (from && !to && hoveredDate && date.toDateString() === hoveredDate.toDateString()) ? 'rounded-r-full' : ''}`}
          onMouseEnter={() => !isPast && !isBlocked && setHoveredDate(date)}
          onMouseLeave={() => setHoveredDate(null)}
        >
            <button
                onClick={() => !isPast && !isBlocked && handleDateClick(date)}
                className={dayClasses}
                disabled={isPast || isBlocked}
            >
                {day}
            </button>
        </div>
      );
    }
    return days;
  };

  const changeMonth = (offset: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + offset);
      return newDate;
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg border">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100">
            <Icon name="ChevronLeft" className="w-5 h-5" />
        </button>
        <div className="text-lg font-semibold text-gray-800">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </div>
        <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100">
            <Icon name="ChevronRight" className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-center text-sm text-gray-500">
        {daysOfWeek.map(day => (
          <div key={day} className="font-medium p-2">{day}</div>
        ))}
        {renderDays()}
      </div>
    </div>
  );
};

export default Calendar;
