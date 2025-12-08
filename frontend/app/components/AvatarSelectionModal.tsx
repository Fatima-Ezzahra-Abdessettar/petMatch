import React, { useState } from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';
import { UserCircleIcon } from '@heroicons/react/24/solid';

interface AvatarSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (avatar: string) => void;
    currentAvatar: string;
    avatars: string[];
}

const AvatarSelectionModal: React.FC<AvatarSelectionModalProps> = ({
    isOpen,
    onClose,
    onSelect,
    currentAvatar,
    avatars
}) => {
    const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);

    if (!isOpen) return null;

    const handleSave = () => {
        onSelect(selectedAvatar);
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="grid grid-cols-3 gap-4 mb-6">
                    {avatars.map((avatar, index) => (
                        <div
                            key={avatar}
                            className={`relative w-20 h-20 rounded-full cursor-pointer border-2 transition-all ${
                                selectedAvatar === avatar
                                    ? 'border-green-500'
                                    : 'border-gray-300 hover:border-gray-400'
                            }`}
                            onClick={() => setSelectedAvatar(avatar)}
                        >
                            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                <UserCircleIcon className="w-full h-full text-gray-400" />
                            </div>
                            {selectedAvatar === avatar && (
                                <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1">
                                    <CheckIcon className="w-4 h-4 text-white" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                
                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AvatarSelectionModal;

