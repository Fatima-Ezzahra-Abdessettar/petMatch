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
      <div className="pets-page">
        <div className="loading-container">
          <FontAwesomeIcon icon={faSpinner} spin size="3x" color="#D29059" />
          <p>Chargement des animaux...</p>
        </div>
        <style>{`
          .pets-page {
            min-height: 100vh;
            background-color: #E5E5E5;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          
          .loading-container {
            text-align: center;
            color: #666;
            max-width: 400px;
          }
          
          .loading-container p {
            margin-top: 20px;
            font-size: 1.1rem;
          }
        `}</style>
      </div>
    );
  }

  // Afficher l'erreur
  if (error) {
    return (
      <div className="pets-page">
        <div className="error-container">
          <FontAwesomeIcon icon={faExclamationTriangle} size="3x" color="#ff6b6b" />
          <h3>Erreur de chargement</h3>
          <p>{error}</p>
          <button 
            className="retry-btn"
            onClick={fetchPets}
          >
            Réessayer
          </button>
        </div>
        <style>{`
          .pets-page {
            min-height: 100vh;
            background-color: #E5E5E5;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          
          .error-container {
            text-align: center;
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            max-width: 500px;
          }
          
          .error-container h3 {
            margin: 20px 0 10px;
            color: #333;
          }
          
          .error-container p {
            color: #666;
            margin-bottom: 20px;
          }
          
          .retry-btn {
            padding: 10px 20px;
            background: #D29059;
            border: none;
            border-radius: 6px;
            color: white;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s;
          }
          
          .retry-btn:hover {
            background: #c57a45;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="pets-page">
      <main className="page-content">
        <div className="content-card">
          {/* En-tête */}
          <div className="list-header">
            <h2 className="list-title">
              Pets list
              <span className="total-count"> ({filteredPets.length})</span>
            </h2>
            
            {/* Filtres */}
            <div className="filters-container">
              <button 
                className={`filter-btn ${isFilterOpen ? 'active' : ''}`}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                aria-expanded={isFilterOpen}
                aria-label="Filter options"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span>Filters</span>
                {(selectedFilters.species.length > 0 || selectedFilters.ageRange.length > 0) && (
                  <span className="filter-count">
                    {selectedFilters.species.length + selectedFilters.ageRange.length}
                  </span>
                )}
              </button>

              {isFilterOpen && (
                <>
                  <div 
                    className="filters-overlay" 
                    onClick={() => setIsFilterOpen(false)} 
                    role="presentation"
                  />
                  <div className="filters-dropdown" role="dialog" aria-label="Filter options">
                    {/* Section Species */}
                    <div className="filter-section">
                      <button 
                        className="filter-section-header"
                        onClick={() => toggleSection('species')}
                        aria-expanded={isSpeciesOpen}
                      >
                        <span>Species</span>
                        <FontAwesomeIcon 
                          icon={faChevronDown} 
                          className={`chevron-icon ${isSpeciesOpen ? 'rotated' : ''}`}
                        />
                      </button>
                      
                      {isSpeciesOpen && (
                        <div className="filter-options">
                          {speciesOptions.map(option => {
                            const isSelected = selectedFilters.species.includes(option.value);
                            return (
                              <button
                                key={option.value}
                                className={`filter-option ${isSelected ? 'selected' : ''}`}
                                onClick={() => toggleFilter('species', option.value)}
                                aria-pressed={isSelected}
                              >
                                <span className="filter-option-label">{option.label}</span>
                                {isSelected && (
                                  <span className="checkmark">✓</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Section Age */}
                    <div className="filter-section">
                      <button 
                        className="filter-section-header"
                        onClick={() => toggleSection('age')}
                        aria-expanded={isAgeOpen}
                      >
                        <span>Age</span>
                        <FontAwesomeIcon 
                          icon={faChevronDown} 
                          className={`chevron-icon ${isAgeOpen ? 'rotated' : ''}`}
                        />
                      </button>
                      
                      {isAgeOpen && (
                        <div className="filter-options">
                          {ageOptions.map(option => {
                            const isSelected = selectedFilters.ageRange.includes(option.value);
                            return (
                              <button
                                key={option.value}
                                className={`filter-option ${isSelected ? 'selected' : ''}`}
                                onClick={() => toggleFilter('ageRange', option.value)}
                                aria-pressed={isSelected}
                              >
                                <span className="filter-option-label">{option.label}</span>
                                {isSelected && (
                                  <span className="checkmark">✓</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Boutons d'action */}
                    <div className="filter-actions">
                      <button 
                        className="filter-clear-btn"
                        onClick={() => {
                          setSelectedFilters({ species: [], ageRange: [] });
                        }}
                      >
                        Clear all
                      </button>
                      <button 
                        className="filter-apply-btn"
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
              <div className="pets-grid-container">
                <div className="pets-grid">
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
                <div className="pagination">
                  <div className="pagination-info">
                    {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredPets.length)} of {filteredPets.length}
                  </div>
                  
                  <div className="pagination-controls">
                    <span className="page-label">Page</span>
                    <select 
                      className="page-select"
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
                    
                    <div className="nav-buttons">
                      <button 
                        className="nav-btn"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                      >
                        <FontAwesomeIcon icon={faChevronLeft} />
                      </button>
                      
                      <button 
                        className="nav-btn"
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
            <div className="no-results">
              <p>No pets found matching your filters.</p>
              {pets.length === 0 ? (
                <div className="empty-state">
                  <p>No pets available at the moment.</p>
                  <button 
                    className="refresh-btn"
                    onClick={fetchPets}
                  >
                    <FontAwesomeIcon icon={faSpinner} spin={loading} /> Refresh
                  </button>
                </div>
              ) : (
                <button 
                  className="clear-filters-btn"
                  onClick={() => setSelectedFilters({ species: [], ageRange: [] })}
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Styles */}
      <style>{`
        .pets-page {
          min-height: 100vh;
          background-color: #E5E5E5;
          padding: 20px;
        }
        
        .page-content {
          padding: 0;
        }

        .content-card {
          background: white;
          border-radius: 12px;
          padding: 15px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .list-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #333;
          margin: 0;
        }

        .total-count {
          font-size: 1rem;
          color: #666;
          font-weight: normal;
          margin-left: 10px;
        }

        .filters-container {
          position: relative;
        }

        .filter-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 10px 20px;
          cursor: pointer;
          font-size: 0.95rem;
          color: #666;
          transition: all 0.2s;
          position: relative;
        }

        .filter-btn:hover,
        .filter-btn.active {
          background-color: #f8f8f8;
          border-color: #D29059;
          color: #D29059;
        }

        .filter-btn svg {
          width: 16px;
          height: 16px;
        }

        .filter-count {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #D29059;
          color: white;
          font-size: 0.75rem;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .filters-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 999;
          background: transparent;
        }

        .filters-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 240px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          overflow: hidden;
        }

        .filter-section {
          border-bottom: 1px solid #f0f0f0;
        }

        .filter-section:last-child {
          border-bottom: none;
        }

        .filter-section-header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 14px 16px;
          background: #f8f8f8;
          border: none;
          cursor: pointer;
          font-size: 0.95rem;
          color: #333;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .filter-section-header:hover {
          background: #f0f0f0;
        }

        .filter-section-header span {
          text-align: left;
        }

        .chevron-icon {
          width: 12px;
          height: 12px;
          color: #666;
          transition: transform 0.2s;
        }

        .chevron-icon.rotated {
          transform: rotate(180deg);
        }

        .filter-options {
          background: white;
          padding: 4px 0;
        }

        .filter-option {
          width: 100%;
          padding: 12px 16px;
          border: none;
          background: white;
          text-align: left;
          cursor: pointer;
          font-size: 0.9rem;
          color: #555;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .filter-option:hover {
          background: #f8f8f8;
          color: #D29059;
        }

        .filter-option.selected {
          background: #FEF3DD;
          color: #D29059;
          font-weight: 500;
        }

        .filter-option-label {
          flex: 1;
        }

        .checkmark {
          color: #D29059;
          font-weight: bold;
          font-size: 0.9rem;
        }

        .filter-actions {
          display: flex;
          gap: 10px;
          padding: 16px 20px;
          background: #f8f8f8;
          border-top: 1px solid #f0f0f0;
        }

        .filter-clear-btn {
          flex: 1;
          padding: 10px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          color: #666;
          transition: all 0.2s;
        }

        .filter-clear-btn:hover {
          background: #f8f8f8;
          border-color: #999;
        }

        .filter-apply-btn {
          flex: 1;
          padding: 10px;
          background: #D29059;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          color: white;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .filter-apply-btn:hover {
          background: #c57a45;
        }

        /* Conteneur pour un espacement égal */
        .pets-grid-container {
          width: 100%;
          margin-bottom: 30px;
        }

        /* Grille avec espacement égal de tous les côtés */
        .pets-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          width: 100%;
        }

        /* Pour garantir que chaque carte prend exactement la même largeur */
        .pets-grid > * {
          min-width: 0; /* Important pour éviter le débordement */
        }

        /* Pour les écrans moyens : 3 cartes par ligne */
        @media (max-width: 1200px) {
          .pets-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        /* Pour les tablettes : 2 cartes par ligne */
        @media (max-width: 900px) {
          .pets-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* Pour les mobiles : 1 carte par ligne */
        @media (max-width: 600px) {
          .pets-grid {
            grid-template-columns: 1fr;
          }
        }

        .pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }

        .pagination-info {
          color: #666;
          font-size: 0.9rem;
        }

        .pagination-controls {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .page-label {
          color: #666;
          font-size: 0.9rem;
        }

        .page-select {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          font-size: 0.9rem;
          min-width: 60px;
        }

        .page-select:focus {
          outline: none;
          border-color: #D29059;
        }

        .nav-buttons {
          display: flex;
          gap: 8px;
        }

        .nav-btn {
          background: white;
          border: 1px solid #ddd;
          border-radius: 6px;
          width: 35px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          color: #666;
        }

        .nav-btn:hover:not(:disabled) {
          background-color: #D29059;
          border-color: #D29059;
          color: white;
        }

        .nav-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .no-results {
          text-align: center;
          padding: 60px 20px;
          color: #666;
        }

        .no-results p {
          margin-bottom: 20px;
          font-size: 1.1rem;
        }

        .empty-state {
          margin-top: 20px;
        }

        .empty-state p {
          margin-bottom: 15px;
          color: #999;
          font-style: italic;
        }

        .refresh-btn, .clear-filters-btn {
          padding: 10px 20px;
          background: #D29059;
          border: none;
          border-radius: 6px;
          color: white;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .refresh-btn:hover, .clear-filters-btn:hover {
          background: #c57a45;
        }

        /* Responsive pour le sidebar */
        @media (max-width: 768px) {
          .pets-page {
            margin-left: 70px;
            padding: 10px;
          }

          .content-card {
            padding: 20px;
          }

          .pagination {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }

          .pagination-controls {
            width: 100%;
            justify-content: space-between;
          }

          .filters-dropdown {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 300px;
          }
        }
      `}</style>
    </div>
  );
};

export default PetsPage;