// frontend/app/routes/Favorites.tsx
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import PetCard from '../components/petCard';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiFilter, FiSearch, FiX } from 'react-icons/fi';
import type { Pet } from '../types';

export default function Favorites() {
  const { favorites, fetchFavorites, toggleFavorite } = useContext(UserContext)!;
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    gender: '',
    age: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        await fetchFavorites();
      } catch (error) {
        console.error('Failed to fetch favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFavorites();
  }, [fetchFavorites]);

  const handleRemoveFromFavorites = async (petId: number) => {
    try {
      // S'assurer que l'ID est bien un nombre
      const numericPetId = Number(petId);
      if (isNaN(numericPetId)) {
        throw new Error('Invalid pet ID');
      }
      await toggleFavorite(numericPetId, true); // Passer true pour indiquer la suppression
    } catch (error) {
      console.error('Failed to remove from favorites:', error);
    }
  };

  const filteredPets = (favorites as Pet[])?.filter((pet) => {
    const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pet.breed?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilters = 
      (!filters.type || pet.type === filters.type) &&
      (!filters.gender || pet.gender === filters.gender) &&
      (!filters.age || pet.ageGroup === filters.age);
    
    return matchesSearch && matchesFilters;
  }) || [];

  const clearFilters = () => {
    setFilters({ type: '', gender: '', age: '' });
    setSearchTerm('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-orange-600 mb-3">My Favorite Pets</h1>
          <p className="text-gray-600">All the pets you've fallen in love with</p>
        </motion.div>

        {/* Search and Filter Bar */}
        <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name or breed..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <FiFilter className="mr-2" />
              {showFilters ? 'Hide Filters' : 'Filters'}
            </button>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pet Type</label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        value={filters.type}
                        onChange={(e) => setFilters({...filters, type: e.target.value})}
                      >
                        <option value="">All Types</option>
                        <option value="dog">Dog</option>
                        <option value="cat">Cat</option>
                        <option value="bird">Bird</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        value={filters.gender}
                        onChange={(e) => setFilters({...filters, gender: e.target.value})}
                      >
                        <option value="">All Genders</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        value={filters.age}
                        onChange={(e) => setFilters({...filters, age: e.target.value})}
                      >
                        <option value="">All Ages</option>
                        <option value="puppy">Puppy/Kitten</option>
                        <option value="young">Young</option>
                        <option value="adult">Adult</option>
                        <option value="senior">Senior</option>
                      </select>
                    </div>
                  </div>
                  {(filters.type || filters.gender || filters.age) && (
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={clearFilters}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-orange-700 bg-orange-100 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                      >
                        <FiX className="mr-1" /> Clear Filters
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Count */}
        {searchTerm || filters.type || filters.gender || filters.age ? (
          <div className="mb-6 text-sm text-gray-600">
            Showing {filteredPets.length} {filteredPets.length === 1 ? 'result' : 'results'}
            {(searchTerm || filters.type || filters.gender || filters.age) && (
              <button 
                onClick={clearFilters}
                className="ml-2 text-orange-600 hover:text-orange-800"
              >
                (Clear all)
              </button>
            )}
          </div>
        ) : null}

        {/* Pets Grid */}
        {filteredPets.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-lg shadow-sm"
          >
            <div className="mx-auto w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-4">
              <FiHeart className="text-orange-400 text-4xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No favorites found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {favorites.length === 0 
                ? "You haven't added any pets to your favorites yet. Browse our pets and click the heart to add them here!"
                : "No pets match your current filters. Try adjusting your search or filters."}
            </p>
            {favorites.length > 0 && (
              <button
                onClick={clearFilters}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Clear all filters
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredPets.map((pet) => (
                <motion.div
                  key={pet.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  <PetCard props={pet} />
                  <button
                    onClick={() => handleRemoveFromFavorites(pet.id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md text-red-500 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 z-10"
                    aria-label="Remove from favorites"
                  >
                    <FiHeart className="w-5 h-5 fill-current" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}