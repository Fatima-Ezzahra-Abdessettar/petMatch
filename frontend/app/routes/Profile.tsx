import React, { useContext, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';
import PersonalDetailsForm from '../components/PersonalDetailsForm';
import PasswordChangeForm from '../components/PasswordChangeForm';
import FavoritesList from '../components/FavoritesList';

const Profile: React.FC = () => {
    const context = useContext(UserContext)!;
    const user = context.user || null; // Fallback to null if context is undefined

    useEffect(() => {
        context.fetchUser();
        context.fetchFavorites();
    }, []);

    if (!user) return <div>No user found</div>;

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-orange-600 mb-6">Mon Profil</h1>
            <PersonalDetailsForm />
            <PasswordChangeForm />
            <FavoritesList favorites={context.favorites} />
        </div>
    );
};

export default Profile;