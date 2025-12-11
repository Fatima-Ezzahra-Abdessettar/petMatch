import React, { createContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import api, { setAuthToken } from '../api/client';
import type { Pet } from '~/types';
import axios from 'axios';

interface UserContextType {
    user: any | null;
    favorites: Pet[];
    setUser: (user: any) => void;
    setFavorites: (favorites: Pet[]) => void;
    fetchUser: () => void;
    fetchFavorites: () => void;
    toggleFavorite: (petId: number, isFavorite: boolean) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any | null>(null);
    const [favorites, setFavorites] = useState<Pet[]>([]);

    const fetchUser = useCallback(async () => {
        try {
            const res = await api.get('/api/me');
            setUser(res.data.user);
        } catch (error) {
            console.error('Erreur fetch user', error);
        }
    }, []);

    const fetchFavorites = useCallback(async () => {
        try {
            // Backend registers favorites at /api/favorites
            const res = await api.get('/api/favorites');
            setFavorites(res.data);
        } catch (error) {
            console.error('Erreur fetch favorites', error);
        }
    }, []);

    const toggleFavorite = useCallback(async (petId: number, isFavorite: boolean) => {
        try {
            if (isFavorite) {
                await api.delete(`/api/pets/${petId}/favorites`);
            } else {
                await api.post(`/api/pets/${petId}/favorites`);
            }
            fetchFavorites();
        } catch (error) {
            console.error('Erreur toggle favorite', error);
        }
    }, [fetchFavorites]);

    useEffect(() => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                setAuthToken(token);
                fetchUser();
                fetchFavorites();
            }
        } catch (e) {
            // ignore if localStorage not available
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, favorites, setUser, setFavorites, fetchUser, fetchFavorites, toggleFavorite }}>
            {children}
        </UserContext.Provider>
    );
};