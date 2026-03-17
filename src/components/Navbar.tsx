import { Settings } from 'lucide-react';

interface NavbarProps {
  onSettingsClick: () => void;
}

export function Navbar({ onSettingsClick }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-blue-950/90 to-blue-900/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left - Settings Button */}
          <button
            onClick={onSettingsClick}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
            aria-label="Settings"
          >
            <Settings className="w-6 h-6" />
          </button>
          
          {/* Center - Title with GT Logo */}
          <div className="flex items-center space-x-3">
            <span className="text-white/90 italic text-lg md:text-xl font-bold tracking-wide hidden sm:inline">Can you guess the</span>
            <span className="text-white/90 italic text-lg md:text-xl font-bold tracking-wide sm:hidden">Guess the</span>
            <img 
              src="/gt_logo.png" 
              alt="GT" 
              className="h-7 md:h-8 w-auto object-contain"
            />
            <span className="text-white/90 text-lg italic md:text-xl font-bold tracking-wide">car?</span>
          </div>
          
          {/* Right - Empty spacer for balance */}
          <div className="w-10" />
        </div>
      </div>
    </nav>
  );
}
