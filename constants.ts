import { Room, Booking, Amenity } from './types';

export const STANDARD_AMENITIES: Amenity[] = [
  { name: 'Wi-Fi', icon: 'Wifi' },
  { name: 'Whiteboard', icon: 'Presentation' },
  { name: 'Pool', icon: 'Pool' },
  { name: 'TV Screen', icon: 'Tv' },
  { name: 'Video Conferencing', icon: 'Mic' },
  { name: 'Catering Available', icon: 'Coffee' },
  { name: 'Air Conditioning', icon: 'Wind' },
  { name: 'Coffee Machine', icon: 'Coffee' },
  { name: 'Multiple Screens', icon: 'Tv' },
  { name: 'Smart Board', icon: 'Presentation' },
];

export const SAMPLE_ROOMS: Room[] = [
  {
    id: 'room-1',
    name: 'The Focus Den',
    capacity: 4,
    price: 100,
    amenities: [
      { name: 'Wi-Fi', icon: 'Wifi' },
      { name: 'Whiteboard', icon: 'Presentation' },
    ],
    imageUrl: 'https://picsum.photos/seed/room1/600/400',
  },
  {
    id: 'room-2',
    name: 'Collaborate Corner',
    capacity: 8,
    price: 150,
    amenities: [
      { name: 'Wi-Fi', icon: 'Wifi' },
      { name: 'TV Screen', icon: 'Tv' },
      { name: 'Video Conferencing', icon: 'Mic' },
    ],
    imageUrl: 'https://picsum.photos/seed/room2/600/400',
  },
  {
    id: 'room-3',
    name: 'The Boardroom',
    capacity: 16,
    price: 250,
    amenities: [
      { name: 'Wi-Fi', icon: 'Wifi' },
      { name: 'Catering Available', icon: 'Coffee' },
      { name: 'Air Conditioning', icon: 'Wind' },
    ],
    imageUrl: 'https://picsum.photos/seed/room3/600/400',
  },
  {
    id: 'room-4',
    name: 'Innovation Hub',
    capacity: 12,
    price: 225,
    amenities: [
        { name: 'Wi-Fi', icon: 'Wifi' },
        { name: 'Smart Board', icon: 'Presentation' },
        { name: 'Coffee Machine', icon: 'Coffee' },
        { name: 'Multiple Screens', icon: 'Tv' },
    ],
    imageUrl: 'https://picsum.photos/seed/room4/600/400',
  },
];

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const formatDate = (date: Date) => date.toISOString().split('T')[0];

export const SAMPLE_BOOKINGS: Booking[] = [
  {
    id: 'booking-1',
    roomId: 'room-1',
    userId: 'admin1',
    date: formatDate(today),
    startTime: '10:00',
    endTime: '11:00',
    userName: 'Admin User',
    userEmail: 'admin@example.com',
    status: 'Confirmed',
  },
  {
    id: 'booking-2',
    roomId: 'room-3',
    userId: 'user123',
    date: formatDate(tomorrow),
    startTime: '14:00',
    endTime: '16:00',
    userName: 'Jane Doe',
    userEmail: 'jane.doe@example.com',
    status: 'Confirmed',
  },
];

export const TIME_SLOTS = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
];