import React from 'react';
import { IconType } from '../types';

interface IconProps {
  name: IconType | 'Calendar' | 'Clock' | 'ChevronLeft' | 'ChevronRight' | 'X';
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, className = 'w-6 h-6' }) => {
  // FIX: Replaced JSX.Element with React.ReactElement to resolve namespace issue.
  const icons: { [key: string]: React.ReactElement } = {
    Users: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />,
    Wifi: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.555a5.5 5.5 0 017.778 0M12 20.25a2.75 2.75 0 010-5.5 2.75 2.75 0 010 5.5zM4.444 12.889a9.167 9.167 0 0115.112 0" />,
    Tv: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v1a3 3 0 003 3h4a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />,
    Coffee: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3.25A2.25 2.25 0 0010.75 1H6.25A2.25 2.25 0 004 3.25V10m9 0a9 9 0 01-9 0m9 0h.01M4 10h.01M4 10a9 9 0 009 9m-9-9h9" />,
    Wind: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-3.314 0-6 2.686-6 6s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6zM12 8V4m0 8v4m4-4h4m-8-4H4" />,
    Presentation: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />,
    Mic: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />,
    Pool: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8s4-4 8 0 8 0 8 0" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16s4-4 8 0 8 0 8 0" /></>,
    Calendar: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    Clock: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
    ChevronLeft: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />,
    ChevronRight: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />,
    X: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />,
  };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {icons[name] || null}
    </svg>
  );
};

export default Icon;