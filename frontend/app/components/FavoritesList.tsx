import React, { useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';

interface FavoritesListProps {
    favorites: any[];
}

const FavoritesList: React.FC<FavoritesListProps> = ({ favorites }) => {
    const { setFavorites, fetchFavorites } = useContext(UserContext)!;

    const removeFavorite = async (petId: number) => {
        try {
            await axios.delete(`/api/pets/${petId}/favorites`); // Appel backend DELETE
            fetchFavorites(); // Refresh liste
        } catch (error) {
            alert('Erreur lors de la suppression');
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">Mes Favoris</h2>
            {favorites.length === 0 ? (
                <p>Aucun favori pour le moment.</p>
            ) : (
                <ul className="space-y-4">
                    {favorites.map((pet) => (
                        <li key={pet.id} className="flex justify-between items-center border-b pb-2">
                            <span>{pet.name} ({pet.species})</span>
                            <button onClick={() => removeFavorite(pet.id)} className="text-red-500 hover:underline">Retirer</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FavoritesList;