// frontend/app/routes/Favorites.tsx
import React, { useContext, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';
import PetCard from '../components/petCard';
import { motion } from 'framer-motion';

export default function Favorites() {
  const { favorites, fetchFavorites } = useContext(UserContext)!;

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  if (!favorites) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-orange-600 text-center mb-10"
        >
          My Favorit Pets ❤️
        </motion.h1>

        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">You don't have any favorites yet</p>
            <p className="text-gray-500 mt-2">Browse the animals and click on the heart!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {favorites.map((pet: any) => (
              <motion.div
                key={pet.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <PetCard props={pet} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}