// frontend/app/routes/Favorites.tsx
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import PetCard from '../components/petCard';
import PetFilters from '../components/PetFilters';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiSearch } from 'react-icons/fi';
import type { Pet } from '../types';
import AuthenticatedLayout from '../components/AuthenticatedLayout';

interface FilterState {
  species: string[];
  ageRange: string[];
}

export default function Favorites() {
  const { favorites, fetchFavorites, toggleFavorite } = useContext(UserContext)!;
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // PetFilters state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    species: [],
    ageRange: []
  });
  const [openSections, setOpenSections] = useState<string[]>(['species', 'age']);

  // Filter options
  const speciesOptions = [
    { label: 'Dog', value: 'dog' },
    { label: 'Cat', value: 'cat' },
    { label: 'Bird', value: 'bird' },
    { label: 'Other', value: 'other' }
  ];

  const ageOptions = [
    { label: 'Puppy/Kitten', value: 'puppy' },
    { label: 'Young', value: 'young' },
    { label: 'Adult', value: 'adult' },
    { label: 'Senior', value: 'senior' }
  ];

  const toggleSection = (section: string) => {
    setOpenSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

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
      const numericPetId = Number(petId);
      if (isNaN(numericPetId)) {
        throw new Error('Invalid pet ID');
      }
      await toggleFavorite(numericPetId, true);
    } catch (error) {
      console.error('Failed to remove from favorites:', error);
    }
  };

  const filteredPets = (favorites as Pet[])?.filter((pet) => {
    const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pet.breed?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecies = selectedFilters.species.length === 0 || 
                           selectedFilters.species.includes(pet.type ?? '');
    
    const matchesAge = selectedFilters.ageRange.length === 0 || 
                       selectedFilters.ageRange.includes(pet.ageGroup ?? '');
    
    return matchesSearch && matchesSpecies && matchesAge;
  }) || [];

  const clearFilters = () => {
    setSelectedFilters({ species: [], ageRange: [] });
    setSearchTerm('');
  };

  const hasActiveFilters = selectedFilters.species.length > 0 || 
                          selectedFilters.ageRange.length > 0 || 
                          searchTerm !== '';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <AuthenticatedLayout>
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
            <div className="flex flex-col md:flex-row gap-4">
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
              <PetFilters
                isFilterOpen={isFilterOpen}
                setIsFilterOpen={setIsFilterOpen}
                selectedFilters={selectedFilters}
                setSelectedFilters={setSelectedFilters}
                speciesOptions={speciesOptions}
                ageOptions={ageOptions}
                openSections={openSections}
                toggleSection={toggleSection}
              />
            </div>
          </div>

          {/* Results Count */}
          {hasActiveFilters && (
            <div className="mb-6 text-sm text-gray-600">
              Showing {filteredPets.length} {filteredPets.length === 1 ? 'result' : 'results'}
              <button 
                onClick={clearFilters}
                className="ml-2 text-orange-600 hover:text-orange-800"
              >
                (Clear all)
              </button>
            </div>
          )}

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
    </AuthenticatedLayout>
  );
}