import { Check, X, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import type { Guess } from '../types';

interface GuessGridProps {
  guesses: Guess[];
}

interface CellProps {
  value: string | number;
  status: 'match' | 'close' | 'far' | 'mismatch';
  direction?: 'up' | 'down' | null;
  isImage?: boolean;
  imgUrl?: string;
  isFlag?: boolean;
}

function ComparisonCell({ value, status, direction, isImage, imgUrl, isFlag }: CellProps) {
  const getBgColor = () => {
    switch (status) {
      case 'match':
        return 'bg-emerald-500/90';
      case 'close':
        return 'bg-amber-500/90';
      case 'far':
      case 'mismatch':
        return 'bg-rose-500/90';
      default:
        return 'bg-gray-500/50';
    }
  };
  
  const getIcon = () => {
    if (status === 'match') {
      return <Check className="w-4 h-4 text-white" />;
    }
    if (status === 'mismatch') {
      return <X className="w-4 h-4 text-white" />;
    }
    if (direction === 'up') {
      return <ArrowUp className="w-4 h-4 text-white" />;
    }
    if (direction === 'down') {
      return <ArrowDown className="w-4 h-4 text-white" />;
    }
    return <Minus className="w-4 h-4 text-white/50" />;
  };
  
  if (isImage) {
    return (
      <div className="p-2">
        <div className="w-24 h-16 bg-gray-800 rounded-lg overflow-hidden">
          <img
            src={imgUrl}
            alt="Car"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="96" height="64" fill="%23333"><rect width="96" height="64"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23666" font-size="10">No Image</text></svg>';
            }}
          />
        </div>
      </div>
    );
  }
  
  // For flag emoji, make it larger and centered
  if (isFlag) {
    return (
      <div className={`p-3 rounded-lg ${getBgColor()} flex items-center justify-center space-x-2 min-h-[48px]`}>
        <span className="text-2xl">{value}</span>
        {getIcon()}
      </div>
    );
  }
  
  return (
    <div className={`p-3 rounded-lg ${getBgColor()} flex items-center justify-center space-x-2 min-h-[48px]`}>
      <span className="text-white font-bold">{value}</span>
      {getIcon()}
    </div>
  );
}

function getCategoricalStatus(value: 'match' | 'mismatch'): 'match' | 'mismatch' {
  return value;
}

function getNumericStatus(comparison: { status: string; direction: string | null }): { status: 'match' | 'close' | 'far'; direction: 'up' | 'down' | null } {
  return {
    status: comparison.status as 'match' | 'close' | 'far',
    direction: comparison.direction as 'up' | 'down' | null,
  };
}

export function GuessGrid({ guesses }: GuessGridProps) {
  if (guesses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white/40 text-lg">Make your first guess to start the game!</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[900px]">
        {/* Header */}
        <div className="grid grid-cols-10 gap-2 mb-3 px-2">
          <div className="text-center">
            <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Vehicle</span>
          </div>
          <div className="text-center">
            <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Country</span>
          </div>
          <div className="text-center">
            <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Brand</span>
          </div>
          <div className="text-center">
            <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Year</span>
          </div>
          <div className="text-center">
            <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Drive</span>
          </div>
          <div className="text-center">
            <span className="text-xs font-bold text-white/60 uppercase tracking-wider">HP</span>
          </div>
          <div className="text-center">
            <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Torque</span>
          </div>
          <div className="text-center">
            <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Weight</span>
          </div>
          <div className="text-center">
            <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Type</span>
          </div>
        </div>
        
        {/* Guesses */}
        <div className="space-y-3">
          {guesses.map((guess) => (
            <div key={guess.id} className="grid grid-cols-10 gap-2 animate-in slide-in-from-top-2 duration-300">
              {/* Image */}
              <ComparisonCell 
                value="" 
                status="match" 
                isImage 
                imgUrl={guess.imgUrl} 
              />
              
              {/* Country Flag */}
              <ComparisonCell 
                value={guess.country} 
                status={getCategoricalStatus(guess.comparison.country)} 
                isFlag
              />
              
              {/* Brand */}
              <ComparisonCell 
                value={guess.brand} 
                status={getCategoricalStatus(guess.comparison.brand)} 
              />
              
              {/* Year */}
              <ComparisonCell 
                value={guess.year} 
                {...getNumericStatus(guess.comparison.year)} 
              />
              
              {/* Drive */}
              <ComparisonCell 
                value={guess.drive} 
                status={getCategoricalStatus(guess.comparison.drive)} 
              />
              
              {/* HP */}
              <ComparisonCell 
                value={guess.hp} 
                {...getNumericStatus(guess.comparison.hp)} 
              />
              
              {/* Torque */}
              <ComparisonCell 
                value={guess.torque} 
                {...getNumericStatus(guess.comparison.torque)} 
              />
              
              {/* Weight */}
              <ComparisonCell 
                value={guess.weight} 
                {...getNumericStatus(guess.comparison.weight)} 
              />
              
              {/* Type */}
              <ComparisonCell 
                value={guess.carType} 
                status={getCategoricalStatus(guess.comparison.type)} 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
