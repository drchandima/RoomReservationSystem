import React, { useState, useCallback } from 'react';
import { Booking, Room, Amenity } from '../../types';
import Icon from '../Icon';
import EditRoomModal from '../EditRoomModal';
import { STANDARD_AMENITIES } from '../../constants';

interface AdminPanelViewProps {
  rooms: Room[];
  bookings: Booking[];
  cancelBooking: (bookingId: string) => void;
  onSuggestAmenities: (roomName: string) => Promise<string[]>;
  addRoom: (roomData: Omit<Room, 'id'>) => void;
  updateRoom: (roomData: Room) => void;
}

const AdminPanelView: React.FC<AdminPanelViewProps> = ({ rooms, bookings, cancelBooking, onSuggestAmenities, addRoom, updateRoom }) => {
  const getRoomName = (roomId: string) => rooms.find(r => r.id === roomId)?.name || 'Unknown Room';
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRoomForSuggestions, setSelectedRoomForSuggestions] = useState<string | null>(null);

  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomCapacity, setNewRoomCapacity] = useState('');
  const [newRoomAmenities, setNewRoomAmenities] = useState<Set<string>>(new Set());
  const [newRoomImageUrl, setNewRoomImageUrl] = useState('');
  const [formError, setFormError] = useState('');

  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const handleFetchSuggestions = useCallback(async (room: Room) => {
    setIsLoading(true);
    setSelectedRoomForSuggestions(room.name);
    setSuggestions([]);
    const result = await onSuggestAmenities(room.name);
    setSuggestions(result);
    setIsLoading(false);
  }, [onSuggestAmenities]);

  const handleNewRoomAmenityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNewRoomAmenities(prev => {
        const newSet = new Set(prev);
        if (checked) {
            newSet.add(name);
        } else {
            newSet.delete(name);
        }
        return newSet;
    });
  };

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const capacity = parseInt(newRoomCapacity, 10);

    if (!newRoomName.trim() || isNaN(capacity) || capacity <= 0) {
      setFormError('Please provide a valid room name and a positive number for capacity.');
      return;
    }
    setFormError('');

    const amenities: Amenity[] = STANDARD_AMENITIES.filter(amenity => newRoomAmenities.has(amenity.name));

    addRoom({
      name: newRoomName,
      capacity,
      amenities,
      imageUrl: newRoomImageUrl.trim() || `https://picsum.photos/seed/${newRoomName.replace(/\s+/g, '-')}/600/400`,
    });

    // Reset form fields
    setNewRoomName('');
    setNewRoomCapacity('');
    setNewRoomAmenities(new Set());
    setNewRoomImageUrl('');
  };


  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <p className="mt-2 text-lg text-gray-600">Manage all rooms and bookings across the system.</p>
      </div>

      {/* Room Management Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Room Management</h2>
        
        {/* Add New Room Form */}
        <form onSubmit={handleAddRoom} className="mb-8 p-4 border rounded-lg bg-gray-50 space-y-4">
            <h3 className="text-xl font-semibold text-gray-700">Add New Room</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="roomName" className="block text-sm font-medium text-gray-700">Room Name</label>
                    <input type="text" id="roomName" value={newRoomName} onChange={e => setNewRoomName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g., The Hive" />
                </div>
                <div>
                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">Capacity</label>
                    <input type="number" id="capacity" value={newRoomCapacity} onChange={e => setNewRoomCapacity(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g., 8" />
                </div>
                 <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Amenities</label>
                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {STANDARD_AMENITIES.map(amenity => (
                        <div key={amenity.name} className="flex items-center">
                            <input
                            id={`new-${amenity.name}`}
                            name={amenity.name}
                            type="checkbox"
                            checked={newRoomAmenities.has(amenity.name)}
                            onChange={handleNewRoomAmenityChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`new-${amenity.name}`} className="ml-2 block text-sm text-gray-900">
                            {amenity.name}
                            </label>
                        </div>
                        ))}
                    </div>
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL (optional)</label>
                    <input type="text" id="imageUrl" value={newRoomImageUrl} onChange={e => setNewRoomImageUrl(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="https://example.com/image.jpg" />
                </div>
            </div>
            {formError && <p className="text-red-500 text-sm">{formError}</p>}
            <button type="submit" className="w-full sm:w-auto bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors duration-300">
                Add Room
            </button>
        </form>

        <h3 className="text-xl font-semibold text-gray-700 mb-4">Existing Rooms & AI Tools</h3>
        <div className="space-y-4">
          {rooms.map(room => (
            <div key={room.id} className="border p-4 rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="font-semibold text-lg">{room.name}</p>
                <p className="text-sm text-gray-500">Capacity: {room.capacity} | Amenities: {room.amenities.length}</p>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                 <button
                  onClick={() => setEditingRoom(room)}
                  className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleFetchSuggestions(room)}
                  className="bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors duration-200 text-sm"
                >
                  Suggest Amenities
                </button>
              </div>
            </div>
          ))}
        </div>
        {selectedRoomForSuggestions && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700">Amenity Suggestions for "{selectedRoomForSuggestions}":</h3>
            {isLoading ? <p className="text-gray-500 mt-2">Generating suggestions...</p> : (
              <div className="flex flex-wrap gap-2 mt-2">
                {suggestions.map((s, i) => (
                  <span key={i} className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">{s}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Booking Management Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">All Bookings ({bookings.length})</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">No bookings found.</td>
                </tr>
              ) : (
                bookings.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(booking => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{getRoomName(booking.roomId)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.userName}</div>
                      <div className="text-sm text-gray-500">{booking.userEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{new Date(booking.date).toLocaleDateString()}</div>
                        <div className="text-sm text-gray-500">{booking.startTime} - {booking.endTime}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => window.confirm(`Cancel booking for ${booking.userName}?`) && cancelBooking(booking.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {editingRoom && (
        <EditRoomModal
            isOpen={!!editingRoom}
            onClose={() => setEditingRoom(null)}
            room={editingRoom}
            onSave={updateRoom}
        />
      )}
    </div>
  );
};

export default AdminPanelView;