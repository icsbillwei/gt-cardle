import { useState, useEffect, useCallback, useMemo } from 'react';
import Papa from 'papaparse';
import seedrandom from 'seedrandom';
import type { Car, Guess, GameSettings, GameState, CarTypeFilter } from '../types';

const CSV_URL = '/gt6_year_updated.csv';

const VALID_DRIVES = ['FF', 'FR', 'MR', 'RR', '4WD'] as const;

interface ParsedRow {
  brand: string;
  model: string;
  drive: string;
  hp: string;
  weight: string;
  torque: string;
  year: string;
  img_url: string;
  car_type: string;
  country: string;
}

function generateRandomSeed(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function normalizeDrive(drive: string): Car['drive'] | null {
  const normalized = drive.toUpperCase().trim();
  if (VALID_DRIVES.includes(normalized as Car['drive'])) {
    return normalized as Car['drive'];
  }
  return null;
}

function parseCSVData(results: Papa.ParseResult<ParsedRow>): Car[] {
  const cars: Car[] = [];
  
  for (let i = 0; i < results.data.length; i++) {
    const row = results.data[i];
    
    // Skip if any essential field is empty
    if (!row.brand || !row.model || !row.drive || !row.hp || !row.weight || 
        !row.torque || !row.year || !row.img_url || !row.car_type) {
      continue;
    }
    
    // Normalize drive type
    const drive = normalizeDrive(row.drive);
    if (!drive) {
      continue;
    }
    
    const hp = parseInt(row.hp, 10);
    const weight = parseInt(row.weight, 10);
    const torque = parseInt(row.torque, 10);
    const year = parseInt(row.year, 10);
    
    // Skip if any numeric field is invalid
    if (isNaN(hp) || isNaN(weight) || isNaN(torque) || isNaN(year)) {
      continue;
    }
    
    // Normalize car type
    const carTypeUpper = row.car_type.trim();
    let carType: Car['carType'];
    if (carTypeUpper === 'Street' || carTypeUpper === 'Race' || carTypeUpper === 'Tuned') {
      carType = carTypeUpper;
    } else {
      continue;
    }
    
    cars.push({
      id: `${row.brand}-${row.model}-${row.year}-${i}`,
      brand: row.brand.trim(),
      model: row.model.trim(),
      drive,
      hp,
      weight,
      torque,
      year,
      imgUrl: row.img_url.trim(),
      carType,
      country: row.country?.trim() || '🏳️',
    });
  }
  
  return cars;
}

function filterCars(cars: Car[], filter: CarTypeFilter): Car[] {
  switch (filter) {
    case 'Road':
      return cars.filter(car => car.carType === 'Street');
    case 'Race':
      return cars.filter(car => car.carType === 'Race');
    case 'Tuner':
      return cars.filter(car => car.carType === 'Tuned');
    case 'All':
    default:
      return cars;
  }
}

function selectTargetCar(cars: Car[], seed: string): Car {
  const rng = seedrandom(seed);
  const index = Math.floor(rng() * cars.length);
  return cars[index];
}

function compareGuessToTarget(guess: Car, target: Car): Guess['comparison'] {
  const yearDelta = guess.year - target.year;
  const hpDelta = guess.hp - target.hp;
  const torqueDelta = guess.torque - target.torque;
  const weightDelta = guess.weight - target.weight;
  
  const getNumericComparison = (delta: number, closeThreshold: number): 
    { status: 'match'; direction: null } | 
    { status: 'close' | 'far'; direction: 'up' | 'down' } => {
    if (delta === 0) {
      return { status: 'match', direction: null };
    }
    if (Math.abs(delta) <= closeThreshold) {
      return { 
        status: 'close', 
        direction: delta > 0 ? 'down' : 'up' 
      };
    }
    return { 
      status: 'far', 
      direction: delta > 0 ? 'down' : 'up' 
    };
  };
  
  return {
    brand: guess.brand === target.brand ? 'match' : 'mismatch',
    country: guess.country === target.country ? 'match' : 'mismatch',
    drive: guess.drive === target.drive ? 'match' : 'mismatch',
    type: guess.carType === target.carType ? 'match' : 'mismatch',
    year: getNumericComparison(yearDelta, 2),
    hp: getNumericComparison(hpDelta, 20),
    torque: getNumericComparison(torqueDelta, 20),
    weight: getNumericComparison(weightDelta, 50),
  };
}

export function useGameState() {
  // Data state
  const [allCars, setAllCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Settings state
  const [settings, setSettings] = useState<GameSettings>({
    seed: generateRandomSeed(),
    carTypeFilter: 'Road',
  });
  
  // Game state
  const [gameState, setGameState] = useState<GameState>({
    timeElapsed: 0,
    tries: 0,
    isWon: false,
    isRevealed: false,
    guesses: [],
  });
  
  // UI state
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Load CSV data
  useEffect(() => {
    setIsLoading(true);
    Papa.parse<ParsedRow>(CSV_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedCars = parseCSVData(results);
        setAllCars(parsedCars);
        setIsLoading(false);
      },
      error: (err) => {
        setError(err.message);
        setIsLoading(false);
      },
    });
  }, []);
  
  // Filtered cars based on settings
  const filteredCars = useMemo(() => {
    return filterCars(allCars, settings.carTypeFilter);
  }, [allCars, settings.carTypeFilter]);
  
  // Target car based on seed and filtered cars
  const targetCar = useMemo(() => {
    if (filteredCars.length === 0) return null;
    return selectTargetCar(filteredCars, settings.seed);
  }, [filteredCars, settings.seed]);
  
  // Timer effect
  useEffect(() => {
    if (gameState.isWon || gameState.isRevealed || isLoading) return;
    
    const interval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        timeElapsed: prev.timeElapsed + 1,
      }));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [gameState.isWon, gameState.isRevealed, isLoading]);
  
  // Submit a guess
  const submitGuess = useCallback((car: Car) => {
    if (!targetCar || gameState.isWon || gameState.isRevealed) return;
    
    const comparison = compareGuessToTarget(car, targetCar);
    const guess: Guess = { ...car, comparison };
    
    const isCorrect = 
      comparison.brand === 'match' &&
      comparison.drive === 'match' &&
      comparison.type === 'match' &&
      comparison.year.status === 'match' &&
      comparison.hp.status === 'match' &&
      comparison.torque.status === 'match' &&
      comparison.weight.status === 'match';
    
    setGameState(prev => ({
      ...prev,
      guesses: [guess, ...prev.guesses],
      tries: prev.tries + 1,
      isWon: isCorrect,
    }));
    
    setSearchQuery('');
  }, [targetCar, gameState.isWon]);
  
  // Reset game with new settings
  const resetGame = useCallback((newSettings?: Partial<GameSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    if (newSettings) {
      setSettings(updatedSettings);
    }
    
    setGameState({
      timeElapsed: 0,
      tries: 0,
      isWon: false,
      isRevealed: false,
      guesses: [],
    });
    setSearchQuery('');
  }, [settings]);
  
  // Generate new seed
  const generateNewSeed = useCallback(() => {
    return generateRandomSeed();
  }, []);
  
  // Reveal the answer
  const revealAnswer = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isRevealed: true,
    }));
  }, []);
  
  // Format time as MM:SS
  const formattedTime = useMemo(() => {
    const minutes = Math.floor(gameState.timeElapsed / 60);
    const seconds = gameState.timeElapsed % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [gameState.timeElapsed]);
  
  return {
    // Data
    allCars,
    filteredCars,
    targetCar,
    isLoading,
    error,
    
    // Settings
    settings,
    setSettings,
    
    // Game state
    gameState,
    formattedTime,
    
    // UI state
    showSettings,
    setShowSettings,
    searchQuery,
    setSearchQuery,
    
    // Actions
    submitGuess,
    resetGame,
    generateNewSeed,
    revealAnswer,
  };
}
