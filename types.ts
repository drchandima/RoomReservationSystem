export interface Room {
  id: string;
  name: string;
  capacity: number;
  price: number; // Price per night
  amenities: Amenity[];
  imageUrl: string;
}

export interface Amenity {
  name: string;
  icon: IconType;
}

export type IconType = 'Users' | 'Wifi' | 'Tv' | 'Coffee' | 'Wind' | 'Presentation' | 'Mic' | 'Pool' | 'DollarSign';

export interface Booking {
  id: string;
  roomId: string;
  userId: string;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  userName: string;
  userEmail: string;
  status: 'Confirmed' | 'Cancelled';
}

export type UserRole = 'User' | 'Admin';

export type View = 'Browse' | 'MyReservations' | 'Admin';