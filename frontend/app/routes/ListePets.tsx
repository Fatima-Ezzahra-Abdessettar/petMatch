// src/pages/listepets.tsx
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import PetCard from '../components/petCard';
import PetFilters from '../components/PetFilters';
import Sidebar from '../components/SideBar';
import TopNavBar from '~/components/TopNavBar'; // Import ajouté
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faSpinner,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';

interface Pet {
  id: number;
  name: string;
  profile_picture: string;
  species: string;
  type: string;
  age: number;
  description: string;
  shelter_id: number;
  added_by: number;
  adopted_by: number | null;
  gender: string;
  status: string;
  created_at: string;
  updated_at: string;
  shelter: {
    id: number;
    name: string;
    address: string;
    city: string;
    country: string;
    phone: string;
    email: string;
    created_at: string | null;
    updated_at: string | null;
  };
}

interface FilterState {
  species: string[];
  ageRange: string[];
}

const PetsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    species: [],
    ageRange: [],
  });

  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 8;
  const API_URL = 'http://127.0.0.1:8000/api/pets';

  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(prev => !prev);

  const fetchPets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL, {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      const data = await response.json();
      setPets(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Impossible de charger les animaux');
      setPets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const speciesOptions = useMemo(() => {
    const unique = [...new Set(pets.map(p => p.species))];
    return unique.map(s => {
      let label = s;
      if (s === 'dog') label = 'Dogs';
      if (s === 'cat') label = 'Cats';
      if (!['dog', 'cat'].includes(s.toLowerCase())) {
        label = s.charAt(0).toUpperCase() + s.slice(1);
      }
      return { label, value: s };
    });
  }, [pets]);

  const ageOptions = [
    { label: '<12 months', value: '<12' },
    { label: 'Between 1 & 3 years', value: '1-3' },
    { label: 'More than 3 years', value: '>3' },
  ];

  const toggleSection = useCallback((section: string) => {
    setOpenSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  }, []);

  const filteredPets = useMemo(() => {
    return pets.filter(pet => {
      if (selectedFilters.species.length > 0 && !selectedFilters.species.includes(pet.species)) {
        return false;
      }
      if (selectedFilters.ageRange.length > 0) {
        const age = pet.age;
        const hasMatch = selectedFilters.ageRange.some(range => {
          if (range === '<12') return age < 1;
          if (range === '1-3') return age >= 1 && age <= 3;
          if (range === '>3') return age > 3;
          return false;
        });
        if (!hasMatch) return false;
      }
      return true;
    });
  }, [pets, selectedFilters]);

  const totalPages = Math.ceil(filteredPets.length / itemsPerPage);
  const currentPets = filteredPets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => setCurrentPage(1), [selectedFilters]);

  const adaptPetForCard = (pet: Pet) => ({
    id: pet.id,
    name: pet.name,
    species: pet.species,
    type: pet.type,
    age: pet.age,
    gender: pet.gender,
    profile_picture: pet.profile_picture,
    status: pet.status,
    description: pet.description,
    shelter: pet.shelter,
  });

  // Loading & Error
  if (loading) {
    return (
      <div className="min-h-screen bg-[#E5E5E5] flex items-center justify-center p-5">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin size="3x" color="#D29059" />
          <p className="mt-5 text-lg text-[#666]">Chargement des animaux...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#E5E5E5] flex items-center justify-center p-5">
        <div className="text-center bg-white p-10 rounded-xl shadow-lg max-w-md">
          <FontAwesomeIcon icon={faExclamationTriangle} size="3x" color="#ff6b6b" />
          <h3 className="mt-5 text-xl font-medium text-[#333]">Erreur</h3>
          <p className="text-[#666] my-4">{error}</p>
          <button onClick={fetchPets} className="px-6 py-3 bg-[#D29059] text-white rounded-lg hover:bg-[#c57a45]">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#E5E5E5]">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      {/* Contenu principal avec TopNavBar en haut */}
      <div className="flex-1 flex flex-col">
        {/* TopNavBar fixe en haut */}
        <TopNavBar />

        {/* Contenu de la page (décalé sous la navbar) */}
        <div className={`flex-1 transition-all duration-300 ${isOpen ? 'lg:ml-52' : 'lg:ml-0'}`}>
          <div className="p-4 md:p-6 lg:p-8">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-5 md:p-8 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-2xl font-semibold text-[#333]">
                    Pets list
                    <span className="text-base font-normal text-[#666] ml-3">
                      ({filteredPets.length})
                    </span>
                  </h2>

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

              <div className="p-5 md:p-8">
                {filteredPets.length > 0 ? (
                  <>
                    <div
                      className={`grid gap-6
                        grid-cols-1
                        sm:grid-cols-2
                        md:grid-cols-3
                        lg:grid-cols-3
                        xl:grid-cols-4
                        ${isOpen ? '2xl:grid-cols-3' : '2xl:grid-cols-4'}
                      `}
                    >
                      {currentPets.map(pet => (
                        <PetCard key={pet.id} props={adaptPetForCard(pet)} />
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div className="mt-10 flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t">
                        <div className="text-sm text-[#666]">
                          {(currentPage - 1) * itemsPerPage + 1} -{' '}
                          {Math.min(currentPage * itemsPerPage, filteredPets.length)} sur {filteredPets.length}
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="w-10 h-10 rounded-lg border flex items-center justify-center disabled:opacity-40 hover:bg-[#D29059] hover:text-white transition"
                          >
                            <FontAwesomeIcon icon={faChevronLeft} />
                          </button>
                          <span className="text-sm text-[#666] px-3">
                            Page {currentPage} / {totalPages}
                          </span>
                          <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="w-10 h-10 rounded-lg border flex items-center justify-center disabled:opacity-40 hover:bg-[#D29059] hover:text-white transition"
                          >
                            <FontAwesomeIcon icon={faChevronRight} />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-20">
                    <p className="text-lg text-[#666] mb-6">
                      Aucun animal trouvé avec ces filtres.
                    </p>
                    <button
                      onClick={() => setSelectedFilters({ species: [], ageRange: [] })}
                      className="px-6 py-3 bg-[#D29059] text-white rounded-lg hover:bg-[#c57a45]"
                    >
                      Effacer les filtres
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetsPage;