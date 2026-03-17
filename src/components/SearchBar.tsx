import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import type { Car } from '../types';

interface SearchBarProps {
  cars: Car[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectCar: (car: Car) => void;
  disabled: boolean;
}

function highlightMatch(text: string, query: string) {
  if (!query) return text;
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, i) => 
    regex.test(part) ? (
      <span key={i} className="font-bold text-yellow-400">{part}</span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export function SearchBar({ 
  cars, 
  searchQuery, 
  setSearchQuery, 
  onSelectCar,
  disabled 
}: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Filter and sort cars based on search query
  const filteredCars = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase().trim();
    
    // Score each car based on match quality
    const scoredCars = cars
      .filter(car => {
        const brandLower = car.brand.toLowerCase();
        const modelLower = car.model.toLowerCase();
        const fullNameLower = `${brandLower} ${modelLower}`;
        return brandLower.includes(query) || modelLower.includes(query) || fullNameLower.includes(query);
      })
      .map(car => {
        const brandLower = car.brand.toLowerCase();
        const modelLower = car.model.toLowerCase();
        const fullNameLower = `${brandLower} ${modelLower}`;
        let score = 0;
        
        // Highest priority: Full brand+model starts with query (e.g., "Audi A2" matches "Audi A2")
        if (fullNameLower.startsWith(query)) {
          score += 150;
        }
        // High priority: Brand starts with query
        if (brandLower.startsWith(query)) {
          score += 100;
        }
        // High priority: Model starts with query
        if (modelLower.startsWith(query)) {
          score += 80;
        }
        // Medium priority: Full name contains query
        else if (fullNameLower.includes(query)) {
          score += 60;
        }
        // Lower priority: Brand contains query but doesn't start with it
        else if (brandLower.includes(query)) {
          score += 40;
        }
        // Lowest priority: Model contains query but doesn't start with it
        else if (modelLower.includes(query)) {
          score += 20;
        }
        
        // Bonus for exact matches
        if (brandLower === query || modelLower === query || fullNameLower === query) {
          score += 50;
        }
        
        return { car, score };
      })
      .sort((a, b) => b.score - a.score) // Higher scores first
      .map(({ car }) => car)
      .slice(0, 250);
    
    return scoredCars;
  }, [cars, searchQuery]);
  
  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Reset selected index when filtered cars change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [filteredCars]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsOpen(true);
  };
  
  const handleSelectCar = (car: Car) => {
    onSelectCar(car);
    setIsOpen(false);
    setSearchQuery('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredCars.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredCars.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCars.length) % filteredCars.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelectCar(filteredCars[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };
  
  const formatCarLabel = (car: Car) => {
    const shortYear = car.year.toString().slice(-2);
    return `${car.brand} ${car.model} '${shortYear}`;
  };
  
  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ">
          <Search className="w-5 h-5 text-white/40" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => searchQuery.trim() && setIsOpen(true)}
          placeholder={disabled ? "Game Over!" : "Type here to guess..."}
          disabled={disabled}
          className="w-full pl-12 pr-12 py-4 bg-black/60 border border-white/10 rounded-xl 
                     text-white placeholder-white/40 
                     focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                     transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed"
        />
        
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {/* Dropdown Results */}
      {isOpen && filteredCars.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-black/90 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-2xl max-h-80 overflow-y-auto">
          {filteredCars.map((car, index) => (
            <button
              key={car.id}
              onClick={() => handleSelectCar(car)}
              className={`w-full px-4 py-3 flex items-center space-x-4 text-left transition-all duration-150
                         ${index === selectedIndex ? 'bg-white/10' : 'hover:bg-white/5'}`}
            >
              {/* Car Image */}
              <div className="w-16 h-10 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                <img
                  src={car.imgUrl}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="40" fill="%23333"><rect width="64" height="40"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23666" font-size="8">No Image</text></svg>';
                  }}
                />
              </div>
              
              {/* Car Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">
                  {highlightMatch(formatCarLabel(car), searchQuery)}
                </p>
                <p className="text-xs text-white/50">
                  {car.brand} / {car.drive} / {car.hp} HP / {car.weight} KG
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
      
      {/* No Results */}
      {isOpen && searchQuery.trim() && filteredCars.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-black/90 backdrop-blur-md border border-white/10 rounded-xl p-4 text-center">
          <p className="text-white/50">No cars found matching &quot;{searchQuery}&quot;</p>
        </div>
      )}
    </div>
  );
}
