// src/components/PetFilters.tsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterState {
  species: string[];
  ageRange: string[];
}

interface PetFiltersProps {
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
  selectedFilters: FilterState;
  setSelectedFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  speciesOptions: FilterOption[];
  ageOptions: FilterOption[];
  openSections: string[];
  toggleSection: (section: string) => void;
}

const PetFilters: React.FC<PetFiltersProps> = ({
  isFilterOpen,
  setIsFilterOpen,
  selectedFilters,
  setSelectedFilters,
  speciesOptions,
  ageOptions,
  openSections,
  toggleSection,
}) => {
  const totalFilters = selectedFilters.species.length + selectedFilters.ageRange.length;
  const isSpeciesOpen = openSections.includes('species');
  const isAgeOpen = openSections.includes('age');

  const toggleFilter = (category: 'species' | 'ageRange', value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(v => v !== value)
        : [...prev[category], value]
    }));
  };

  const clearAll = () => {
    setSelectedFilters({ species: [], ageRange: [] });
  };

  return (
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
        {totalFilters > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#D29059] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {totalFilters}
          </span>
        )}
      </button>

      {isFilterOpen && (
        <>
          <div
            className="fixed inset-0 z-[999] bg-transparent"
            onClick={() => setIsFilterOpen(false)}
          />
          <div className="absolute top-[calc(100%+8px)] right-0 w-60 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] z-[1000] overflow-hidden">
            {/* Species */}
            <div className="border-b border-[#f0f0f0]">
              <button
                className="w-full flex items-center justify-between gap-2.5 px-4 py-3.5 bg-[#f8f8f8] border-none cursor-pointer text-sm text-[#333] font-medium hover:bg-[#f0f0f0]"
                onClick={() => toggleSection('species')}
              >
                <span>Species</span>
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
                        className={`w-full px-4 py-3 text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-[#FEF3DD] text-[#D29059] font-medium'
                            : 'text-[#555] hover:bg-[#f8f8f8] hover:text-[#D29059]'
                        }`}
                        onClick={() => toggleFilter('species', option.value)}
                      >
                        <span className="flex-1">{option.label}</span>
                        {isSelected && <span className="text-[#D29059] font-bold text-sm">Check</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Age */}
            <div className="border-b border-[#f0f0f0]">
              <button
                className="w-full flex items-center justify-between gap-2.5 px-4 py-3.5 bg-[#f8f8f8] border-none cursor-pointer text-sm text-[#333] font-medium hover:bg-[#f0f0f0]"
                onClick={() => toggleSection('age')}
              >
                <span>Age</span>
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
                        className={`w-full px-4 py-3 text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-[#FEF3DD] text-[#D29059] font-medium'
                            : 'text-[#555] hover:bg-[#f8f8f8] hover:text-[#D29059]'
                        }`}
                        onClick={() => toggleFilter('ageRange', option.value)}
                      >
                        <span className="flex-1">{option.label}</span>
                        {isSelected && <span className="text-[#D29059] font-bold text-sm">Check</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2.5 px-5 py-4 bg-[#f8f8f8] border-t border-[#f0f0f0]">
              <button
                className="flex-1 px-2.5 py-2.5 bg-white border border-[#ddd] rounded-md text-sm text-[#666] hover:bg-[#f8f8f8]"
                onClick={clearAll}
              >
                Clear all
              </button>
              <button
                className="flex-1 px-2.5 py-2.5 bg-[#D29059] text-white rounded-md font-medium hover:bg-[#c57a45]"
                onClick={() => setIsFilterOpen(false)}
              >
                Apply
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PetFilters;