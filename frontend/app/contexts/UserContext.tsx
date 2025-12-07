import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';

interface UserContextType {
    user: any | null;
    favorites: any[];
    setUser: (user: any) => void;
    setFavorites: (favorites: any[]) => void;
    fetchUser: () => void;
    fetchFavorites: () => void;
    toggleFavorite: (petId: number, isFavorite: boolean) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any | null>(null);
    const [favorites, setFavorites] = useState<any[]>([]);

    const fetchUser = async () => {
        try {
            const res = await axios.get('/api/me');
            setUser(res.data.user);
        } catch (error) {
            console.error('Erreur fetch user');
        }
    };

    const fetchFavorites = async () => {
        try {
            const res = await axios.get('/api/me/favorites');
            setFavorites(res.data);
        } catch (error) {
            console.error('Erreur fetch favorites');
        }
    };

    const toggleFavorite = async (petId: number, isFavorite: boolean) => {
        try {
            if (isFavorite) {
                await axios.delete(`/api/pets/${petId}/favorites`);
            } else {
                await axios.post(`/api/pets/${petId}/favorites`);
            }
            fetchFavorites();
        } catch (error) {
            console.error('Erreur toggle favorite');
        }
    };

    useEffect(() => {
        if (localStorage.getItem('token')) {
            fetchUser();
            fetchFavorites();
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, favorites, setUser, setFavorites, fetchUser, fetchFavorites, toggleFavorite }}>
            {children}
        </UserContext.Provider>
    );
};