import React, { useContext, useEffect, useState, useRef } from 'react';
import { UserContext } from '../contexts/UserContext';
import PersonalDetailsForm from '../components/PersonalDetailsForm';
import type { PersonalDetailsFormHandle } from '../components/PersonalDetailsForm';
import PasswordChangeForm from '../components/PasswordChangeForm';
import AuthenticatedLayout from '../components/AuthenticatedLayout';
import { useTheme } from '~/contexts/themeContext';

const Profile: React.FC = () => {
    const context = useContext(UserContext);
    const { isDarkMode } = useTheme();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const personalDetailsFormRef = useRef<PersonalDetailsFormHandle>(null);

    // If the context doesn't exist (no UserProvider)
    if (!context) {
        return (
            <div
                className="flex min-h-screen items-center justify-center duration-300"
                style={{ backgroundColor: isDarkMode ? "#36332E" : "#F7F5EA" }}
            >
                <div className="text-center">
                    <div
                        className="text-lg font-medium duration-300"
                        style={{ color: isDarkMode ? "#F7F5EA" : "#8B6F47" }}
                    >
                        Error: context user missing
                    </div>
                </div>
            </div>
        );
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
            <AuthenticatedLayout>
                <div
                    className="flex min-h-screen items-center justify-center duration-300"
                    style={{ backgroundColor: isDarkMode ? "#36332E" : "#F7F5EA" }}
                >
                    <div className="text-center">
                        <div
                            className="h-16 w-16 animate-spin rounded-full border-t-4 border-b-4 mx-auto mb-4"
                            style={{ borderColor: isDarkMode ? "#D9915B" : "#D29059" }}
                        />
                        <div
                            className="text-lg duration-300"
                            style={{ color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}
                        >
                            Loading...
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    if (!user) {
        return (
            <AuthenticatedLayout>
                <div
                    className="flex min-h-screen items-center justify-center duration-300"
                    style={{ backgroundColor: isDarkMode ? "#36332E" : "#F7F5EA" }}
                >
                    <div className="text-center">
                        <div
                            className="mb-4 text-lg duration-300"
                            style={{ color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}
                        >
                            User not found. Please log in.
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            {/* Main Content */}
            <div
                className="px-8 pb-8 min-h-screen duration-300"
                style={{ backgroundColor: isDarkMode ? "#36332E" : "#F7F5EA" }}
            >
                <div className="mb-6 pt-8">
                    <h1
                        className="text-3xl font-bold mb-1 duration-300"
                        style={{ color: isDarkMode ? "#F5F3ED" : "#8B6F47" }}
                    >
                        Profile
                    </h1>
                    <p
                        className="text-sm duration-300"
                        style={{ color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}
                    >
                        Manage Profile
                    </p>
                </div>

                {user && <PersonalDetailsForm ref={personalDetailsFormRef} user={user} />}
                <PasswordChangeForm />
            </div>
        </AuthenticatedLayout>
    );
};

export default Profile;