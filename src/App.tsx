import { Navbar } from './components/Navbar';
import { GameHeader } from './components/GameHeader';
import { SearchBar } from './components/SearchBar';
import { GuessGrid } from './components/GuessGrid';
import { SettingsModal } from './components/SettingsModal';
import { RevealAnswer } from './components/RevealAnswer';
import { useGameState } from './hooks/useGameState';
import { Loader2, Eye } from 'lucide-react';

function App() {
  const {
    filteredCars,
    targetCar,
    isLoading,
    error,
    settings,
    gameState,
    formattedTime,
    showSettings,
    setShowSettings,
    searchQuery,
    setSearchQuery,
    submitGuess,
    resetGame,
    generateNewSeed,
    revealAnswer,
  } = useGameState();

  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: 'url(/bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="text-center glass rounded-xl p-8">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-lg">Loading car database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: 'url(/bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="text-center max-w-md px-4 glass rounded-xl p-8">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-400 text-2xl">!</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Failed to load car data</h2>
          <p className="text-white/60">{error}</p>
        </div>
      </div>
    );
  }

  const isGameEnded = gameState.isWon || gameState.isRevealed;

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: 'url(/bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Navbar with title */}
      <Navbar onSettingsClick={() => setShowSettings(true)} />

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Game Header - Timer & Tries */}
          <GameHeader 
            timeElapsed={formattedTime}
            tries={gameState.tries}
            isWon={gameState.isWon}
            isRevealed={gameState.isRevealed}
          />

          {/* Reveal Answer Display */}
          {gameState.isRevealed && targetCar && (
            <RevealAnswer targetCar={targetCar} />
          )}

          {/* Search Bar and Reveal Button */}
          <div className="mb-8 space-y-4">
            <SearchBar
              cars={filteredCars}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSelectCar={submitGuess}
              disabled={isGameEnded}
            />
            
            {/* Reveal Answer Button */}
            {!isGameEnded && gameState.guesses.length > 0 && (
              <div className="flex justify-center">
                <button
                  onClick={revealAnswer}
                  className="flex items-center space-x-2 px-6 py-3 bg-amber-400/10 hover:bg-amber-500/80 
                             text-gray-300 font-bold rounded-lg transition-all duration-200
                             border border-amber-500/10 hover:border-amber-400/50
                             shadow-lg shadow-amber-900/20"
                >
                  <Eye className="w-5 h-5" />
                  <span>Give Up & Reveal Answer</span>
                </button>
              </div>
            )}
          </div>

          {/* Guess Grid */}
          <div className="glass rounded-xl p-4 md:p-6">
            <GuessGrid guesses={gameState.guesses} />
          </div>

          {/* Footer */}
          <footer className="mt-12 italic text-center text-white/30 text-sm">
            <p>By Speedyboi • Not affiliated with Polyphony Digital</p>
          </footer>
        </div>
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        currentSettings={settings}
        onApplySettings={resetGame}
        generateNewSeed={generateNewSeed}
      />
    </div>
  );
}

export default App;
