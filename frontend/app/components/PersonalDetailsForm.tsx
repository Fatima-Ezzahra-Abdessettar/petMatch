import React, { useContext, useState, useImperativeHandle, forwardRef } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';
import AvatarSelectionModal from './AvatarSelectionModal';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '~/api/client';

interface UserFormData {
    name: string;
    location: string;
    phone: string;
    email: string;
}

interface PersonalDetailsFormProps {
    user: any;
}

export interface PersonalDetailsFormHandle {
    submit: () => void;
}

const PersonalDetailsForm = forwardRef<PersonalDetailsFormHandle, PersonalDetailsFormProps>(({ user }, ref) => {
    const { setUser } = useContext(UserContext)!;
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=1');
    const [isLoading, setIsLoading] = useState(false);
    
    const { register, handleSubmit, formState: { errors }, reset } = useForm<UserFormData>({
        defaultValues: {
            name: user?.name || '',
            location: user?.location || '',
            phone: user?.phone || '',
            email: user?.email || ''
        }
    });

    // Update form when user data changes
    React.useEffect(() => {
        if (user) {
            reset({
                name: user.name || '',
                location: user.location || '',
                phone: user.phone || '',
                email: user.email || ''
            });
            setSelectedAvatar(user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=1');
        }
    }, [user, reset]);

    const onSubmit = async (data: UserFormData) => {
        setIsLoading(true);
        try {
            // Only send the fields we want to update (no password fields)
            const updateData = {
                name: data.name,
                location: data.location,
                phone: data.phone,
                email: data.email,
                avatar: selectedAvatar
            };

            const res = await api.put('/api/me', updateData);
            if (setUser) {
                setUser({ ...user, ...res.data.user, avatar: selectedAvatar });
            }
            toast.success('Profile updated successfully!', {
                position: 'top-right',
                autoClose: 3000,
            });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to update profile';
            const errors = error.response?.data?.errors;
            
            if (errors) {
                // Display validation errors
                Object.values(errors).flat().forEach((err: any) => {
                    toast.error(err, {
                        position: 'top-right',
                        autoClose: 5000,
                    });
                });
            } else {
                toast.error(errorMessage, {
                    position: 'top-right',
                    autoClose: 5000,
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    useImperativeHandle(ref, () => ({
        submit: () => {
            handleSubmit(onSubmit)();
        }
    }));

    const handleAvatarSelect = (avatar: string) => {
        setSelectedAvatar(avatar);
        setIsAvatarModalOpen(false);
        if (setUser) {
            setUser({ ...user, avatar });
        }
        toast.success('Avatar updated! Click "Save Changes" to confirm.', {
            position: 'top-right',
            autoClose: 3000,
        });
    };

    // Avatar options with actual image URLs
    const avatarOptions = [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=6',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=7',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=8',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=9',
    ];

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Personal Details</h2>
                
                {/* Avatar Section */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {selectedAvatar ? (
                                <img 
                                    src={selectedAvatar} 
                                    alt="User avatar" 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <UserCircleIcon className="w-20 h-20 text-gray-400" />
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsAvatarModalOpen(true)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
                        >
                            Change avatar
                        </button>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            {...register('name')}
                            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                                errors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                    </div>

                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                        </label>
                        <select
                            id="location"
                            {...register('location')}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                            <option value="">Select Location</option>
                            <option value="casablanca">Casablanca</option>
                            <option value="rabat">Rabat</option>
                            <option value="marrakech">Marrakech</option>
                            <option value="fes">Fes</option>
                            <option value="tanger">Tanger</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                        </label>
                        <input
                            id="phone"
                            type="tel"
                            {...register('phone')}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            {...register('email', {
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address',
                                },
                            })}
                            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                                errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                    </div>
                </div>
            </div>

            {isAvatarModalOpen && (
                <AvatarSelectionModal
                    isOpen={isAvatarModalOpen}
                    onClose={() => setIsAvatarModalOpen(false)}
                    onSelect={handleAvatarSelect}
                    currentAvatar={selectedAvatar}
                    avatars={avatarOptions}
                />
            )}
        </>
    );
});

PersonalDetailsForm.displayName = 'PersonalDetailsForm';

export default PersonalDetailsForm;