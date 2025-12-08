import React, { useState, useMemo, useCallback, useEffect } from 'react';
import PetCard from '../components/petCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronLeft, 
  faChevronRight, 
  faChevronDown, 
  faFilter,
  faSpinner,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

// Interface basée sur vos données réelles
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

interface FilterOption {
  label: string;
  value: string;
}

const PetsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    species: [],
    ageRange: []
  });
  
  // États pour l'API
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 8;
  const API_URL = 'http://127.0.0.1:8000/api/pets';

  // Fonction pour récupérer les données
  const fetchPets = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(API_URL, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setPets(data);
      } else {
        setPets([]);
      }
      
    } catch (err: any) {
      setError(err.message || 'Impossible de charger les animaux');
      setPets([]);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  // Charger les données au montage
  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  // Options de filtre basées sur les données réelles
  const speciesOptions = useMemo(() => {
    const uniqueSpecies = [...new Set(pets.map(pet => pet.species))];
    
    return uniqueSpecies.map(species => {
      let label = species;
      if (species === 'dog') label = 'Dogs';
      if (species === 'cat') label = 'Cats';
      if (!['dog', 'cat'].includes(species.toLowerCase())) {
        label = species.charAt(0).toUpperCase() + species.slice(1);
      }
      
      return {
        label: label,
        value: species
      };
    });
  }, [pets]);

  const ageOptions: FilterOption[] = [
    { label: '<12 months', value: '<12' },
    { label: 'Between 1 & 3 years', value: '1-3' },
    { label: 'More than 3 years', value: '>3' }
  ];

  // Fonctions optimisées
  const toggleSection = useCallback((section: string) => {
    setOpenSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  }, []);

  const toggleFilter = useCallback((category: 'species' | 'ageRange', value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(v => v !== value)
        : [...prev[category], value]
    }));
  }, []);

  // Filtrage des pets
  const filteredPets = useMemo(() => {
    return pets.filter(pet => {
      // Filtre par espèce
      if (selectedFilters.species.length > 0) {
        const petSpecies = pet.species.toLowerCase();
        const filterMatch = selectedFilters.species.some(filterSpecies => 
          filterSpecies.toLowerCase() === petSpecies
        );
        if (!filterMatch) return false;
      }

      // Filtre par âge
      if (selectedFilters.ageRange.length > 0) {
        const ageInMonths = pet.age * 12;
        let ageMatch = false;

        selectedFilters.ageRange.forEach(ageFilter => {
          switch (ageFilter) {
            case '<12':
              if (ageInMonths < 12) ageMatch = true;
              break;
            case '1-3':
              if (pet.age >= 1 && pet.age <= 3) ageMatch = true;
              break;
            case '>3':
              if (pet.age > 3) ageMatch = true;
              break;
          }
        });

        if (!ageMatch) return false;
      }

      return true;
    });
  }, [pets, selectedFilters]);

  // Calculs de pagination
  const totalPages = useMemo(() => 
    Math.ceil(filteredPets.length / itemsPerPage), 
    [filteredPets.length]
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPets = filteredPets.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  // Réinitialiser la page quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilters]);

  const isSpeciesOpen = openSections.includes('species');
  const isAgeOpen = openSections.includes('age');

  // Fonction pour adapter les données au format attendu par PetCard
  const adaptPetForCard = (pet: Pet) => {
    return {
      id: pet.id,
      name: pet.name,
      species: pet.species,
      type: pet.type,
      age: pet.age,
      gender: pet.gender,
      profile_picture: pet.profile_picture,
      status: pet.status,
      description: pet.description,
      shelter: pet.shelter
    };
  };

  // Afficher l'état de chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-[#E5E5E5] flex items-center justify-center p-5">
        <div className="text-center text-[#666] max-w-[400px]">
          <FontAwesomeIcon icon={faSpinner} spin size="3x" color="#D29059" />
          <p className="mt-5 text-lg">Chargement des animaux...</p>
        </div>
      </div>
    );
  }

  // Afficher l'erreur
  if (error) {
    return (
      <div className="min-h-screen bg-[#E5E5E5] flex items-center justify-center p-5">
        <div className="text-center bg-white p-10 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.1)] max-w-[500px]">
          <FontAwesomeIcon icon={faExclamationTriangle} size="3x" color="#ff6b6b" />
          <h3 className="mt-5 mb-2.5 text-[#333]">Erreur de chargement</h3>
          <p className="text-[#666] mb-5">{error}</p>
          <button 
            className="px-5 py-2.5 bg-[#D29059] border-none rounded-md text-white font-medium cursor-pointer transition-colors hover:bg-[#c57a45]"
            onClick={fetchPets}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E5E5E5] p-5">
      <main className="p-0">
        <div className="bg-white rounded-xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          {/* En-tête */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold text-[#333] m-0">
              Pets list
              <span className="text-base text-[#666] font-normal ml-2.5"> ({filteredPets.length})</span>
            </h2>
            
            {/* Filtres */}
            <div className="relative">
              <button 
                className={`flex items-center gap-2 bg-white border rounded-lg px-5 py-2.5 cursor-pointer text-sm text-[#666] transition-all relative ${
                  isFilterOpen 
                    ? 'bg-[#f8f8f8] border-[#D29059] text-[#D29059]' 
                    : 'border-[#ddd] hover:bg-[#f8f8f8] hover:border-[#D29059] hover:text-[#D29059]'
                }`}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                aria-expanded={isFilterOpen}
                aria-label="Filter options"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span>Filters</span>
                {(selectedFilters.species.length > 0 || selectedFilters.ageRange.length > 0) && (
                  <span className="absolute -top-2 -right-2 bg-[#D29059] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {selectedFilters.species.length + selectedFilters.ageRange.length}
                  </span>
                )}
              </button>

              {isFilterOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-[999] bg-transparent" 
                    onClick={() => setIsFilterOpen(false)} 
                    role="presentation"
                  />
                  <div className="absolute top-[calc(100%+8px)] right-0 w-60 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] z-[1000] overflow-hidden" role="dialog" aria-label="Filter options">
                    {/* Section Species */}
                    <div className="border-b border-[#f0f0f0]">
                      <button 
                        className="w-full flex items-center justify-between gap-2.5 px-4 py-3.5 bg-[#f8f8f8] border-none cursor-pointer text-sm text-[#333] font-medium transition-colors hover:bg-[#f0f0f0]"
                        onClick={() => toggleSection('species')}
                        aria-expanded={isSpeciesOpen}
                      >
                        <span className="text-left">Species</span>
                        <FontAwesomeIcon 
                          icon={faChevronDown} 
                          className={`w-3 h-3 text-[#666] transition-transform ${isSpeciesOpen ? 'rotate-180' : ''}`}
                        />
                      </button>
                      
                      {isSpeciesOpen && (
                        <div className="bg-white py-1">
                          {speciesOptions.map(option => {
                            const isSelected = selectedFilters.species.includes(option.value);
                            return (
                              <button
                                key={option.value}
                                className={`w-full px-4 py-3 border-none bg-white text-left cursor-pointer text-sm transition-all flex items-center justify-between ${
                                  isSelected 
                                    ? 'bg-[#FEF3DD] text-[#D29059] font-medium' 
                                    : 'text-[#555] hover:bg-[#f8f8f8] hover:text-[#D29059]'
                                }`}
                                onClick={() => toggleFilter('species', option.value)}
                                aria-pressed={isSelected}
                              >
                                <span className="flex-1">{option.label}</span>
                                {isSelected && (
                                  <span className="text-[#D29059] font-bold text-sm">✓</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Section Age */}
                    <div className="border-b border-[#f0f0f0]">
                      <button 
                        className="w-full flex items-center justify-between gap-2.5 px-4 py-3.5 bg-[#f8f8f8] border-none cursor-pointer text-sm text-[#333] font-medium transition-colors hover:bg-[#f0f0f0]"
                        onClick={() => toggleSection('age')}
                        aria-expanded={isAgeOpen}
                      >
                        <span className="text-left">Age</span>
                        <FontAwesomeIcon 
                          icon={faChevronDown} 
                          className={`w-3 h-3 text-[#666] transition-transform ${isAgeOpen ? 'rotate-180' : ''}`}
                        />
                      </button>
                      
                      {isAgeOpen && (
                        <div className="bg-white py-1">
                          {ageOptions.map(option => {
                            const isSelected = selectedFilters.ageRange.includes(option.value);
                            return (
                              <button
                                key={option.value}
                                className={`w-full px-4 py-3 border-none bg-white text-left cursor-pointer text-sm transition-all flex items-center justify-between ${
                                  isSelected 
                                    ? 'bg-[#FEF3DD] text-[#D29059] font-medium' 
                                    : 'text-[#555] hover:bg-[#f8f8f8] hover:text-[#D29059]'
                                }`}
                                onClick={() => toggleFilter('ageRange', option.value)}
                                aria-pressed={isSelected}
                              >
                                <span className="flex-1">{option.label}</span>
                                {isSelected && (
                                  <span className="text-[#D29059] font-bold text-sm">✓</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex gap-2.5 px-5 py-4 bg-[#f8f8f8] border-t border-[#f0f0f0]">
                      <button 
                        className="flex-1 px-2.5 py-2.5 bg-white border border-[#ddd] rounded-md cursor-pointer text-sm text-[#666] transition-all hover:bg-[#f8f8f8] hover:border-[#999]"
                        onClick={() => {
                          setSelectedFilters({ species: [], ageRange: [] });
                        }}
                      >
                        Clear all
                      </button>
                      <button 
                        className="flex-1 px-2.5 py-2.5 bg-[#D29059] border-none rounded-md cursor-pointer text-sm text-white font-medium transition-colors hover:bg-[#c57a45]"
                        onClick={() => setIsFilterOpen(false)}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Grille d'animaux - avec espacement égal */}
          {filteredPets.length > 0 ? (
            <>
              <div className="w-full mb-8">
                <div className="grid grid-cols-4 gap-5 w-full">
                  {currentPets.map((pet) => (
                    <PetCard 
                      key={pet.id} 
                      props={adaptPetForCard(pet)} 
                    />
                  ))}
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center pt-5 border-t border-[#eee]">
                  <div className="text-[#666] text-sm">
                    {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredPets.length)} of {filteredPets.length}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-[#666] text-sm">Page</span>
                    <select 
                      className="px-3 py-2 border border-[#ddd] rounded-md bg-white cursor-pointer text-sm min-w-[60px] focus:outline-none focus:border-[#D29059]"
                      value={currentPage}
                      onChange={(e) => handlePageChange(Number(e.target.value))}
                      aria-label="Select page"
                    >
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <option key={page} value={page}>
                          {page}
                        </option>
                      ))}
                    </select>
                    
                    <div className="flex gap-2">
                      <button 
                        className="bg-white border border-[#ddd] rounded-md w-9 h-9 flex items-center justify-center cursor-pointer transition-all text-[#666] hover:bg-[#D29059] hover:border-[#D29059] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                      >
                        <FontAwesomeIcon icon={faChevronLeft} />
                      </button>
                      
                      <button 
                        className="bg-white border border-[#ddd] rounded-md w-9 h-9 flex items-center justify-center cursor-pointer transition-all text-[#666] hover:bg-[#D29059] hover:border-[#D29059] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        aria-label="Next page"
                      >
                        <FontAwesomeIcon icon={faChevronRight} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-15 px-5 text-[#666]">
              <p className="mb-5 text-lg">No pets found matching your filters.</p>
              {pets.length === 0 ? (
                <div className="mt-5">
                  <p className="mb-4 text-[#999] italic">No pets available at the moment.</p>
                  <button 
                    className="px-5 py-2.5 bg-[#D29059] border-none rounded-md text-white font-medium cursor-pointer transition-colors hover:bg-[#c57a45] inline-flex items-center gap-2"
                    onClick={fetchPets}
                  >
                    <FontAwesomeIcon icon={faSpinner} spin={loading} /> Refresh
                  </button>
                </div>
              ) : (
                <button 
                  className="px-5 py-2.5 bg-[#D29059] border-none rounded-md text-white font-medium cursor-pointer transition-colors hover:bg-[#c57a45]"
                  onClick={() => setSelectedFilters({ species: [], ageRange: [] })}
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PetsPage;