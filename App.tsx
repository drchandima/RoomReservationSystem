import React, { useState, useCallback } from 'react';
import { Room, Booking, UserRole, View } from './types';
import { SAMPLE_ROOMS, SAMPLE_BOOKINGS } from './constants';
import Header from './components/Header';
import RoomListView from './components/views/RoomListView';
import MyReservationsView from './components/views/MyReservationsView';
import AdminPanelView from './components/views/AdminPanelView';
import { GoogleGenAI } from '@google/genai';
import { generateAmenitySuggestions } from './services/geminiService';


const App: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>(SAMPLE_ROOMS);
  const [bookings, setBookings] = useState<Booking[]>(SAMPLE_BOOKINGS);
  const [currentUser] = useState<{ id: string; role: UserRole }>({ id: 'user123', role: 'User' });
  const [currentView, setCurrentView] = useState<View>('Browse');
  const [adminRole, setAdminRole] = useState<boolean>(false);

  const addBooking = (booking: Omit<Booking, 'id' | 'userId' | 'status'>) => {
    const newBooking: Booking = {
      ...booking,
      id: `booking-${Date.now()}`,
      userId: currentUser.id,
      status: 'Confirmed',
    };
    setBookings(prev => [...prev, newBooking]);
  };

  const cancelBooking = (bookingId: string) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId));
  };

  const addRoom = (roomData: Omit<Room, 'id'>) => {
    const newRoom: Room = {
      ...roomData,
      id: `room-${Date.now()}`,
    };
    setRooms(prev => [...prev, newRoom]);
  };

  const updateRoom = (updatedRoom: Room) => {
    setRooms(prev => prev.map(room => room.id === updatedRoom.id ? updatedRoom : room));
  };
  
  const toggleRole = () => {
    setAdminRole(prev => !prev);
    setCurrentView(adminRole ? 'Browse' : 'Admin');
  };

  const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;

  const handleSuggestAmenities = useCallback(async (roomName: string): Promise<string[]> => {
    if (!ai) {
        alert("Gemini API key not configured.");
        return ['Projector', 'Whiteboard', 'Coffee Maker']; // Fallback data
    }
    try {
        const suggestions = await generateAmenitySuggestions(ai, roomName);
        return suggestions;
    } catch (error) {
        console.error("Error suggesting amenities:", error);
        alert("Failed to fetch amenity suggestions.");
        return [];
    }
  }, [ai]);


  const renderView = () => {
    if (adminRole) {
       return <AdminPanelView rooms={rooms} bookings={bookings} cancelBooking={cancelBooking} onSuggestAmenities={handleSuggestAmenities} addRoom={addRoom} updateRoom={updateRoom} />;
    }

    switch (currentView) {
      case 'Browse':
        return <RoomListView rooms={rooms} bookings={bookings} addBooking={addBooking} />;
      case 'MyReservations':
        const userBookings = bookings.filter(b => b.userId === currentUser.id);
        return <MyReservationsView bookings={userBookings} rooms={rooms} cancelBooking={cancelBooking} />;
      default:
        return <RoomListView rooms={rooms} bookings={bookings} addBooking={addBooking} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <Header 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        isAdmin={adminRole} 
        toggleRole={toggleRole} 
      />
      <main className="p-4 sm:p-6 md:p-8">
        {renderView()}
      </main>
    </div>
  );
};

export default App;