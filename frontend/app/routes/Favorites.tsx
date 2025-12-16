// frontend/app/routes/Favorites.tsx
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import PetCard from '../components/petCard';
import PetFilters from '../components/PetFilters';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiSearch } from 'react-icons/fi';
import type { Pet } from '../types';
import AuthenticatedLayout from '../components/AuthenticatedLayout';
import { useTheme } from '~/contexts/themeContext';

export default function Favorites() {
  const { favorites, fetchFavorites, toggleFavorite } = useContext(UserContext)!;
  const { isDarkMode } = useTheme();

  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<{
    species: string[];
    ageRange: string[];
  }>({
    species: [],
    ageRange: [],
  });
  const [openSections, setOpenSections] = useState<string[]>([]);

  // Protection contre null/undefined + typage sûr
  const favoritePets = useMemo(() => (favorites ?? []) as Pet[], [favorites]);

  // Options dynamiques à partir des vrais favoris
  const speciesOptions = useMemo(() => {
    const speciesMap = new Map<string, string>();

    favoritePets.forEach(pet => {
      const s = pet.species;
      if (!s) return; // saute si null/undefined

      let label = s;
      if (s === 'dog') label = 'Dogs';
      else if (s === 'cat') label = 'Cats';
      else label = s.charAt(0).toUpperCase() + s.slice(1);

      if (!speciesMap.has(s)) {
        speciesMap.set(s, label);
      }
    });

    return Array.from(speciesMap, ([value, label]) => ({ label, value }));
  }, [favoritePets]);

  const ageOptions = [
    { label: '< 1 an', value: '<12' },
    { label: '1 à 3 ans', value: '1-3' },
    { label: '> 3 ans', value: '>3' },
  ];

  const toggleSection = (section: string) => {
    setOpenSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  useEffect(() => {
    const load = async () => {
      try {
        await fetchFavorites();
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [fetchFavorites]);

  const handleRemove = async (petId: number) => {
    await toggleFavorite(petId, true);
  };

  // Filtrage 100% safe
  const filteredPets = useMemo(() => {
    return favoritePets.filter(pet => {
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
          pet.name.toLowerCase().includes(term) ||
          pet.type?.toLowerCase().includes(term) ||
          pet.shelter?.name.toLowerCase().includes(term);
        if (!matchesSearch) return false;
      }

      if (selectedFilters.species.length > 0 && 
          (!pet.species || !selectedFilters.species.includes(pet.species))) {
        return false;
      }

      if (selectedFilters.ageRange.length > 0) {
        const age = pet.age;
        if (age === null || age === undefined) return false;
        const matchAge = selectedFilters.ageRange.some(range => {
          if (range === '<12') return age < 1;
          if (range === '1-3') return age >= 1 && age <= 3;
          if (range === '>3') return age > 3;
          return false;
        });
        if (!matchAge) return false;
      }

      return true;
    });
  }, [favoritePets, searchTerm, selectedFilters]);

  const clearAll = () => {
    setSearchTerm('');
    setSelectedFilters({ species: [], ageRange: [] });
  };

  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <div
          className="flex min-h-screen items-center justify-center duration-300"
          style={{ backgroundColor: isDarkMode ? "#36332E" : "#F7F5EA" }}
        >
          <div 
            className="h-16 w-16 animate-spin rounded-full border-t-4 border-b-4"
            style={{ borderColor: isDarkMode ? "#D9915B" : "#D29059" }}
          />
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div
        className="min-h-screen py-8 px-4 duration-300"
        style={{ backgroundColor: isDarkMode ? "#36332E" : "#F7F5EA" }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Titre */}
          <h1
            className="text-center text-4xl md:text-5xl font-bold mb-10 duration-300"
            style={{ color: isDarkMode ? "#F5F3ED" : "#8B6F47" }}
          >
            My Favorite Pets
          </h1>

          {/* Recherche + Filtre */}
          <div
            className="mb-8 rounded-2xl shadow-sm p-5 duration-300"
            style={{ backgroundColor: isDarkMode ? "rgba(115, 101, 91, 0.3)" : "white" }}
          >
            <div className="flex flex-col lg:flex-row gap-5 items-center">
              <div className="relative flex-1 w-full">
                <div
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-xl pointer-events-none duration-300"
                  style={{ color: isDarkMode ? "#D9915B" : "#D29059" }}
                >
                  <FiSearch />
                </div>
                <input
                  type="text"
                  placeholder="Nom, race, refuge..."
                  className="w-full pl-12 pr-5 py-4 rounded-xl focus:outline-none focus:ring-2 duration-300"
                  style={{
                    backgroundColor: isDarkMode ? "rgba(115, 101, 91, 0.2)" : "#f9f9f9",
                    color: isDarkMode ? "#F7F5EA" : "#333",
                    borderColor: isDarkMode ? "#D9915B" : "#D29059",
                    outlineColor: isDarkMode ? "#D9915B" : "#D29059"
                  }}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
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

            {(searchTerm || selectedFilters.species.length || selectedFilters.ageRange.length) && (
              <div
                className="mt-4 flex justify-between text-sm duration-300"
                style={{ color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}
              >
                <span>{filteredPets.length} résultat{filteredPets.length > 1 ? 's' : ''}</span>
                <button
                  onClick={clearAll}
                  className="hover:underline duration-300 transition-opacity hover:opacity-80"
                  style={{ color: isDarkMode ? "#D9915B" : "#D29059" }}
                >
                  Tout effacer
                </button>
              </div>
            )}
          </div>

          {/* Résultats */}
          {filteredPets.length === 0 ? (
            <div
              className="text-center py-20 rounded-2xl duration-300"
              style={{ backgroundColor: isDarkMode ? "rgba(115, 101, 91, 0.3)" : "white" }}
            >
              <div
                className="mx-auto mb-6 flex justify-center duration-300"
                style={{ color: isDarkMode ? "#73655B" : "#E5E7EB" }}
              >
                <FiHeart size={112} />
              </div>
              <h3
                className="text-2xl font-bold mb-3 duration-300"
                style={{ color: isDarkMode ? "#F5F3ED" : "#8B6F47" }}
              >
                {favoritePets.length === 0 ? 'Aucun favori' : 'Aucun résultat'}
              </h3>
              <p
                className="max-w-lg mx-auto duration-300"
                style={{ color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}
              >
                {favoritePets.length === 0
                  ? 'Ajoutez des animaux en cliquant sur le cœur !'
                  : 'Essayez d\'autres filtres ou effacez-les.'}
              </p>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {filteredPets.map(pet => (
                  <motion.div 
                    key={pet.id} 
                    layout 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="relative group">
                      <PetCard props={pet} />
                      <button
                        onClick={() => handleRemove(pet.id)}
                        className="absolute top-4 right-4 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all z-10 duration-300"
                        style={{
                          backgroundColor: isDarkMode ? "rgba(115, 101, 91, 0.9)" : "white"
                        }}
                      >
                        <FiHeart 
                          size={24} 
                          fill={isDarkMode ? "#ef4444" : "rgb(239, 68, 68)"}
                          color={isDarkMode ? "#ef4444" : "rgb(239, 68, 68)"} 
                        />
                      </button>
                    </div>
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