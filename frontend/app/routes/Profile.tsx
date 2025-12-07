import React, { useContext, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';
import PersonalDetailsForm from '../components/PersonalDetailsForm';
import PasswordChangeForm from '../components/PasswordChangeForm';

const Profile: React.FC = () => {
    const context = useContext(UserContext);

    // If the context doesn't exist (no UserProvider)
    if (!context) {
        return <div>Error : context user missing</div>;
    }

    const { user, favorites, fetchUser, fetchFavorites } = context;

    useEffect(() => {
        fetchUser();
        fetchFavorites();
    }, [fetchUser, fetchFavorites]);

    if (!user) {
        return <div className="text-center p-10">Not Found...</div>;
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-orange-600 mb-6">My Profil</h1>
            <PersonalDetailsForm />
            <PasswordChangeForm />

        </div>
    );
};

export default Profile;