import { useState } from 'react';
import { X, Copy, RefreshCw, Check } from 'lucide-react';
import type { CarTypeFilter, GameSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: GameSettings;
  onApplySettings: (settings: Partial<GameSettings>) => void;
  generateNewSeed: () => string;
}

export function SettingsModal({ 
  isOpen, 
  onClose, 
  currentSettings, 
  onApplySettings,
  generateNewSeed 
}: SettingsModalProps) {
  const [seed, setSeed] = useState(currentSettings.seed);
  const [carTypeFilter, setCarTypeFilter] = useState<CarTypeFilter>(currentSettings.carTypeFilter);
  const [copied, setCopied] = useState(false);
  
  // Reset local state when modal opens
  if (!isOpen) {
    return null;
  }
  
  const handleGenerateSeed = () => {
    const newSeed = generateNewSeed();
    setSeed(newSeed);
  };
  
  const handleCopySeed = async () => {
    try {
      await navigator.clipboard.writeText(seed);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy seed:', err);
    }
  };
  
  const handleApply = () => {
    onApplySettings({ seed, carTypeFilter });
    onClose();
  };
  
  const handleClose = () => {
    // Reset to current settings when closing without applying
    setSeed(currentSettings.seed);
    setCarTypeFilter(currentSettings.carTypeFilter);
    onClose();
  };
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <h2 className="text-xl font-bold italic text-white">Settings</h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Seed Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">
              Game Seed
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                className="flex-1 px-4 py-2 bg-black/50 border border-white/10 rounded-lg
                           text-white text-sm font-mono
                           focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                placeholder="Enter seed..."
              />
              <button
                onClick={handleGenerateSeed}
                className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg
                           transition-colors flex items-center space-x-1"
                title="Generate new seed"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={handleCopySeed}
                className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg
                           transition-colors flex items-center space-x-1"
                title="Copy seed to clipboard"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-white/40">
              Share this seed with friends to play the same game
            </p>
          </div>
          
          {/* Car Type Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">
              Car Type Filter
            </label>
            <select
              value={carTypeFilter}
              onChange={(e) => setCarTypeFilter(e.target.value as CarTypeFilter)}
              className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg
                         text-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
            >
              <option value="Road">Road cars only</option>
              <option value="Race">Race cars only</option>
              <option value="Tuner">Tuner cars only</option>
              <option value="All">Everything</option>
            </select>
            <p className="text-xs text-white/40">
              {carTypeFilter === 'Road' 
                ? 'Only includes Street cars' 
                : carTypeFilter === 'Race'
                ? 'Only includes Race cars'
                : carTypeFilter === 'Tuner'
                ? 'Only includes Tuned cars'
                : 'Includes Street, Race, and Tuned cars'}
            </p>
          </div>
          
          {/* Warning */}
          {(seed !== currentSettings.seed || carTypeFilter !== currentSettings.carTypeFilter) && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-sm text-amber-400">
                Changes will reset your current game progress
              </p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-white/10 bg-white/5">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-white/70 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium
                       rounded-lg transition-colors shadow-lg shadow-blue-600/20"
          >
            Apply & Restart
          </button>
        </div>
      </div>
    </div>
  );
}
