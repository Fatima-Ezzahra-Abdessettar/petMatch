import React from 'react';
import { FiX } from 'react-icons/fi';

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
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">Choose Your Avatar</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {/* Avatar Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    {avatars.map((avatar, index) => (
                        <button
                            key={index}
                            onClick={() => onSelect(avatar)}
                            className={`relative rounded-full overflow-hidden transition-all hover:scale-105 ${
                                currentAvatar === avatar 
                                    ? 'ring-4 ring-blue-500 ring-offset-2' 
                                    : 'ring-2 ring-gray-200 hover:ring-blue-300'
                            }`}
                        >
                            <img
                                src={avatar}
                                alt={`Avatar ${index + 1}`}
                                className="w-full h-full object-cover aspect-square"
                            />
                        </button>
                    ))}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AvatarSelectionModal;