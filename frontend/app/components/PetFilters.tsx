// src/components/PetFilters.tsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '~/contexts/themeContext';

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
  const { isDarkMode } = useTheme();
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
        className="flex items-center gap-2 border rounded-lg px-5 py-2.5 cursor-pointer text-sm transition-all duration-300 relative"
        style={{
          backgroundColor: isFilterOpen 
            ? (isDarkMode ? "rgba(115, 101, 91, 0.3)" : "#f8f8f8")
            : (isDarkMode ? "rgba(115, 101, 91, 0.2)" : "white"),
          borderColor: isFilterOpen
            ? (isDarkMode ? "#D9915B" : "#D29059")
            : (isDarkMode ? "#73655B" : "#ddd"),
          color: isFilterOpen
            ? (isDarkMode ? "#D9915B" : "#D29059")
            : (isDarkMode ? "#F7F5EA" : "#666")
        }}
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        onMouseEnter={(e) => {
          if (!isFilterOpen) {
            e.currentTarget.style.backgroundColor = isDarkMode ? "rgba(115, 101, 91, 0.3)" : "#f8f8f8";
            e.currentTarget.style.borderColor = isDarkMode ? "#D9915B" : "#D29059";
            e.currentTarget.style.color = isDarkMode ? "#D9915B" : "#D29059";
          }
        }}
        onMouseLeave={(e) => {
          if (!isFilterOpen) {
            e.currentTarget.style.backgroundColor = isDarkMode ? "rgba(115, 101, 91, 0.2)" : "white";
            e.currentTarget.style.borderColor = isDarkMode ? "#73655B" : "#ddd";
            e.currentTarget.style.color = isDarkMode ? "#F7F5EA" : "#666";
          }
        }}
        aria-expanded={isFilterOpen}
        aria-label="Filter options"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span>Filters</span>
        {totalFilters > 0 && (
          <span 
            className="absolute -top-2 -right-2 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-300"
            style={{ backgroundColor: isDarkMode ? "#D9915B" : "#D29059" }}
          >
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
          <div 
            className="absolute top-[calc(100%+8px)] right-0 w-60 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] z-[1000] overflow-hidden transition-colors duration-300"
            style={{ 
              backgroundColor: isDarkMode ? "rgba(54, 51, 46, 0.98)" : "white",
              boxShadow: isDarkMode 
                ? "0 4px 20px rgba(0, 0, 0, 0.5)" 
                : "0 4px 20px rgba(0, 0, 0, 0.15)"
            }}
          >
            {/* Species */}
            <div 
              className="border-b transition-colors duration-300"
              style={{ borderColor: isDarkMode ? "#73655B" : "#f0f0f0" }}
            >
              <button
                className="w-full flex items-center justify-between gap-2.5 px-4 py-3.5 border-none cursor-pointer text-sm font-medium transition-colors duration-300"
                style={{
                  backgroundColor: isDarkMode ? "rgba(115, 101, 91, 0.3)" : "#f8f8f8",
                  color: isDarkMode ? "#F5F3ED" : "#333"
                }}
                onClick={() => toggleSection('species')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDarkMode ? "rgba(115, 101, 91, 0.4)" : "#f0f0f0";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isDarkMode ? "rgba(115, 101, 91, 0.3)" : "#f8f8f8";
                }}
              >
                <span>Species</span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`w-3 h-3 transition-all duration-300 ${isSpeciesOpen ? 'rotate-180' : ''}`}
                  style={{ color: isDarkMode ? "#D9915B" : "#666" }}
                />
              </button>
              {isSpeciesOpen && (
                <div 
                  className="py-1 transition-colors duration-300"
                  style={{ backgroundColor: isDarkMode ? "rgba(54, 51, 46, 0.5)" : "white" }}
                >
                  {speciesOptions.map(option => {
                    const isSelected = selectedFilters.species.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        className="w-full px-4 py-3 text-left flex items-center justify-between transition-all duration-300"
                        style={{
                          backgroundColor: isSelected
                            ? (isDarkMode ? "rgba(217, 145, 91, 0.2)" : "#FEF3DD")
                            : "transparent",
                          color: isSelected
                            ? (isDarkMode ? "#D9915B" : "#D29059")
                            : (isDarkMode ? "#F7F5EA" : "#555"),
                          fontWeight: isSelected ? 500 : 400
                        }}
                        onClick={() => toggleFilter('species', option.value)}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = isDarkMode ? "rgba(115, 101, 91, 0.2)" : "#f8f8f8";
                            e.currentTarget.style.color = isDarkMode ? "#D9915B" : "#D29059";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = "transparent";
                            e.currentTarget.style.color = isDarkMode ? "#F7F5EA" : "#555";
                          }
                        }}
                      >
                        <span className="flex-1">{option.label}</span>
                        {isSelected && (
                          <span 
                            className="font-bold text-sm transition-colors duration-300"
                            style={{ color: isDarkMode ? "#D9915B" : "#D29059" }}
                          >
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Age */}
            <div 
              className="border-b transition-colors duration-300"
              style={{ borderColor: isDarkMode ? "#73655B" : "#f0f0f0" }}
            >
              <button
                className="w-full flex items-center justify-between gap-2.5 px-4 py-3.5 border-none cursor-pointer text-sm font-medium transition-colors duration-300"
                style={{
                  backgroundColor: isDarkMode ? "rgba(115, 101, 91, 0.3)" : "#f8f8f8",
                  color: isDarkMode ? "#F5F3ED" : "#333"
                }}
                onClick={() => toggleSection('age')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDarkMode ? "rgba(115, 101, 91, 0.4)" : "#f0f0f0";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isDarkMode ? "rgba(115, 101, 91, 0.3)" : "#f8f8f8";
                }}
              >
                <span>Age</span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`w-3 h-3 transition-all duration-300 ${isAgeOpen ? 'rotate-180' : ''}`}
                  style={{ color: isDarkMode ? "#D9915B" : "#666" }}
                />
              </button>
              {isAgeOpen && (
                <div 
                  className="py-1 transition-colors duration-300"
                  style={{ backgroundColor: isDarkMode ? "rgba(54, 51, 46, 0.5)" : "white" }}
                >
                  {ageOptions.map(option => {
                    const isSelected = selectedFilters.ageRange.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        className="w-full px-4 py-3 text-left flex items-center justify-between transition-all duration-300"
                        style={{
                          backgroundColor: isSelected
                            ? (isDarkMode ? "rgba(217, 145, 91, 0.2)" : "#FEF3DD")
                            : "transparent",
                          color: isSelected
                            ? (isDarkMode ? "#D9915B" : "#D29059")
                            : (isDarkMode ? "#F7F5EA" : "#555"),
                          fontWeight: isSelected ? 500 : 400
                        }}
                        onClick={() => toggleFilter('ageRange', option.value)}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = isDarkMode ? "rgba(115, 101, 91, 0.2)" : "#f8f8f8";
                            e.currentTarget.style.color = isDarkMode ? "#D9915B" : "#D29059";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = "transparent";
                            e.currentTarget.style.color = isDarkMode ? "#F7F5EA" : "#555";
                          }
                        }}
                      >
                        <span className="flex-1">{option.label}</span>
                        {isSelected && (
                          <span 
                            className="font-bold text-sm transition-colors duration-300"
                            style={{ color: isDarkMode ? "#D9915B" : "#D29059" }}
                          >
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Actions */}
            <div 
              className="flex gap-2.5 px-5 py-4 border-t transition-colors duration-300"
              style={{
                backgroundColor: isDarkMode ? "rgba(115, 101, 91, 0.3)" : "#f8f8f8",
                borderColor: isDarkMode ? "#73655B" : "#f0f0f0"
              }}
            >
              <button
                className="flex-1 px-2.5 py-2.5 border rounded-md text-sm transition-all duration-300"
                style={{
                  backgroundColor: isDarkMode ? "rgba(115, 101, 91, 0.2)" : "white",
                  borderColor: isDarkMode ? "#73655B" : "#ddd",
                  color: isDarkMode ? "#F7F5EA" : "#666"
                }}
                onClick={clearAll}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDarkMode ? "rgba(115, 101, 91, 0.3)" : "#f8f8f8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isDarkMode ? "rgba(115, 101, 91, 0.2)" : "white";
                }}
              >
                Clear all
              </button>
              <button
                className="flex-1 px-2.5 py-2.5 text-white rounded-md font-medium transition-all duration-300"
                style={{
                  backgroundColor: isDarkMode ? "#D9915B" : "#D29059"
                }}
                onClick={() => setIsFilterOpen(false)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDarkMode ? "#C77D47" : "#c57a45";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isDarkMode ? "#D9915B" : "#D29059";
                }}
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