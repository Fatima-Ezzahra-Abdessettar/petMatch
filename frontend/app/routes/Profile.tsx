import React, { useContext, useEffect, useState, useRef } from 'react';
import { UserContext } from '../contexts/UserContext';
import PersonalDetailsForm from '../components/PersonalDetailsForm';
import type { PersonalDetailsFormHandle } from '../components/PersonalDetailsForm';
import PasswordChangeForm from '../components/PasswordChangeForm';
import AuthenticatedLayout from '../components/AuthenticatedLayout';

const Profile: React.FC = () => {
    const context = useContext(UserContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const personalDetailsFormRef = useRef<PersonalDetailsFormHandle>(null);

    // If the context doesn't exist (no UserProvider)
    if (!context) {
        return <div>Error : context user missing</div>;
    }

    const { user, favorites, fetchUser, fetchFavorites } = context;
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await fetchUser();
            await fetchFavorites();
            setIsLoading(false);
        };
        loadData();
    }, [fetchUser, fetchFavorites]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: '#F7F5EA' }}>
                <div className="text-center">
                    <div className="text-gray-600">Loading...</div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: '#F7F5EA' }}>
                <div className="text-center">
                    <div className="text-gray-600 mb-4">User not found. Please log in.</div>
                </div>
            </div>
        );
    }

    return (
        <AuthenticatedLayout>

            {/* Main Content */}
            <div className="px-8 pb-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-1">Profile</h1>
                    <p className="text-gray-600">Manage Profile</p>
                </div>

                {user && <PersonalDetailsForm ref={personalDetailsFormRef} user={user} />}
                <PasswordChangeForm />
            </div>
        </AuthenticatedLayout>
    );
};

export default Profile;