import type { Car } from '../types';

interface RevealAnswerProps {
  targetCar: Car | null;
}

export function RevealAnswer({ targetCar }: RevealAnswerProps) {
  if (!targetCar) return null;

  return (
    <div className="glass rounded-xl p-6 mb-8 border-2 border-amber-500/50">
      <h3 className="text-amber-400 text-lg font-bold text-center mb-4 uppercase tracking-wider">
        Answer Revealed
      </h3>
      
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Car Image */}
        <div className="w-48 h-32 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={targetCar.imgUrl}
            alt={`${targetCar.brand} ${targetCar.model}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="192" height="128" fill="%23333"><rect width="192" height="128"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23666" font-size="12">No Image</text></svg>';
            }}
          />
        </div>
        
        {/* Car Details */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <span className="text-4xl">{targetCar.country}</span>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              {targetCar.brand} {targetCar.model}
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-xs text-white/50 uppercase">Year</p>
              <p className="text-xl font-bold text-white">{targetCar.year}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-xs text-white/50 uppercase">Drive</p>
              <p className="text-xl font-bold text-white">{targetCar.drive}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-xs text-white/50 uppercase">HP</p>
              <p className="text-xl font-bold text-white">{targetCar.hp}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-xs text-white/50 uppercase">Weight</p>
              <p className="text-xl font-bold text-white">{targetCar.weight} kg</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-xs text-white/50 uppercase">Type</p>
              <p className="text-xl font-bold text-white">{targetCar.carType}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
