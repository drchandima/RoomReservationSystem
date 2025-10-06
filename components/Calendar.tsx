import React, { useState } from 'react';
import Icon from './Icon';

interface CalendarProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, setSelectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
      const isSelected = selectedDate.toDateString() === date.toDateString();
      const isToday = today.toDateString() === date.toDateString();
      const isPast = date < today;

      const baseClasses = "w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-200";
      let dayClasses = `${baseClasses} `;
      if (isPast) {
          dayClasses += "text-gray-400 cursor-not-allowed";
      } else if (isSelected) {
          dayClasses += "bg-blue-600 text-white font-bold shadow-lg";
      } else if (isToday) {
          dayClasses += "bg-blue-100 text-blue-700 font-semibold";
      } else {
          dayClasses += "text-gray-700 hover:bg-gray-200 cursor-pointer";
      }

      days.push(
        <div key={day} className="flex justify-center items-center">
            <button
                onClick={() => !isPast && setSelectedDate(date)}
                className={dayClasses}
                disabled={isPast}
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
      <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500">
        {daysOfWeek.map(day => (
          <div key={day} className="font-medium p-2">{day}</div>
        ))}
        {renderDays()}
      </div>
    </div>
  );
};

export default Calendar;
