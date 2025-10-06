export interface Room {
  id: string;
  name: string;
  capacity: number;
  amenities: Amenity[];
  imageUrl: string;
}

export interface Amenity {
  name: string;
  icon: IconType;
}

export type IconType = 'Users' | 'Wifi' | 'Tv' | 'Coffee' | 'Wind' | 'Presentation' | 'Mic' | 'Pool';

export interface Booking {
  id: string;
  roomId: string;
  userId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  userName: string;
  userEmail: string;
  status: 'Confirmed' | 'Cancelled';
}

export type UserRole = 'User' | 'Admin';

export type View = 'Browse' | 'MyReservations' | 'Admin';