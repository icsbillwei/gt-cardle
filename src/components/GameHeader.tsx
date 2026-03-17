import { Clock, Hash } from 'lucide-react';

interface GameHeaderProps {
  timeElapsed: string;
  tries: number;
  isWon: boolean;
  isRevealed?: boolean;
}

export function GameHeader({ timeElapsed, tries, isWon, isRevealed }: GameHeaderProps) {
  return (
    <div className="glass rounded-xl p-4 mb-6">
      <div className="flex items-center justify-center space-x-8">
        {/* Timer */}
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isWon ? 'bg-green-500/20' : 'bg-blue-500/20'}`}>
            <Clock className={`w-5 h-5 ${isWon ? 'text-green-400' : 'text-blue-400'}`} />
          </div>
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wider font-medium">Time</p>
            <p className={`text-2xl font-bold font-mono ${isWon ? 'text-green-400' : 'text-white'}`}>
              {timeElapsed}
            </p>
          </div>
        </div>
        
        {/* Divider */}
        <div className="w-px h-12 bg-white/10" />
        
        {/* Tries */}
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-purple-500/20">
            <Hash className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wider font-medium">Tries</p>
            <p className="text-2xl font-bold font-mono text-white">{tries}</p>
          </div>
        </div>
      </div>
      
      {/* Win Message */}
      {isWon && (
        <div className="mt-4 pt-4 border-t border-white/10 text-center">
          <p className="text-green-400 text-lg font-bold animate-pulse">
            Damn!!!
          </p>
        </div>
      )}
      
      {/* Revealed Message */}
      {isRevealed && (
        <div className="mt-4 pt-4 border-t border-white/10 text-center">
          <p className="text-amber-400 text-lg font-bold">
            Try harder next time!
          </p>
        </div>
      )}
    </div>
  );
}
