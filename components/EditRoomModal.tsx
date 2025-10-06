import React, { useState, useEffect } from 'react';
import { Room, Amenity } from '../types';
import Modal from './Modal';
import { STANDARD_AMENITIES } from '../../constants';

interface EditRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room;
  onSave: (room: Room) => void;
}

const EditRoomModal: React.FC<EditRoomModalProps> = ({ isOpen, onClose, room, onSave }) => {
  const [name, setName] = useState(room.name);
  const [capacity, setCapacity] = useState(room.capacity.toString());
  const [selectedAmenities, setSelectedAmenities] = useState<Set<string>>(new Set());
  const [imageUrl, setImageUrl] = useState(room.imageUrl);
  const [error, setError] = useState('');

  useEffect(() => {
    if (room) {
      setName(room.name);
      setCapacity(room.capacity.toString());
      setSelectedAmenities(new Set(room.amenities.map(a => a.name)));
      setImageUrl(room.imageUrl);
      setError('');
    }
  }, [room]);

  const handleAmenityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSelectedAmenities(prev => {
        const newSet = new Set(prev);
        if (checked) {
            newSet.add(name);
        } else {
            newSet.delete(name);
        }
        return newSet;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedCapacity = parseInt(capacity, 10);
    if (!name.trim() || isNaN(parsedCapacity) || parsedCapacity <= 0) {
      setError('Please provide a valid room name and a positive number for capacity.');
      return;
    }
    setError('');
    
    const finalAmenities: Amenity[] = STANDARD_AMENITIES.filter(amenity => selectedAmenities.has(amenity.name));

    const updatedRoom: Room = {
      ...room,
      name: name.trim(),
      capacity: parsedCapacity,
      amenities: finalAmenities,
      imageUrl: imageUrl.trim() || `https://picsum.photos/seed/${name.trim().replace(/\s+/g, '-')}/600/400`,
    };

    onSave(updatedRoom);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Room: ${room.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="edit-roomName" className="block text-sm font-medium text-gray-700">Room Name</label>
          <input type="text" id="edit-roomName" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="edit-capacity" className="block text-sm font-medium text-gray-700">Capacity</label>
          <input type="number" id="edit-capacity" value={capacity} onChange={e => setCapacity(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Amenities</label>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {STANDARD_AMENITIES.map(amenity => (
                <div key={amenity.name} className="flex items-center">
                    <input
                    id={`edit-${amenity.name}`}
                    name={amenity.name}
                    type="checkbox"
                    checked={selectedAmenities.has(amenity.name)}
                    onChange={handleAmenityChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`edit-${amenity.name}`} className="ml-2 block text-sm text-gray-900">
                    {amenity.name}
                    </label>
                </div>
                ))}
            </div>
        </div>
        <div>
          <label htmlFor="edit-imageUrl" className="block text-sm font-medium text-gray-700">Image URL (optional)</label>
          <input type="text" id="edit-imageUrl" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <div className="pt-4 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-300">
                Cancel
            </button>
            <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                Save Changes
            </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditRoomModal;