export interface Car {
  id: string;
  brand: string;
  model: string;
  drive: 'FF' | 'FR' | 'MR' | 'RR' | '4WD';
  hp: number;
  weight: number;
  torque: number;
  year: number;
  imgUrl: string;
  carType: 'Street' | 'Race' | 'Tuned';
  country: string; // Flag emoji
}

export interface Guess extends Car {
  comparison: {
    brand: 'match' | 'mismatch';
    country: 'match' | 'mismatch'; // No 'close' - only right or wrong
    drive: 'match' | 'mismatch';
    type: 'match' | 'mismatch';
    year: { status: 'match' | 'close' | 'far'; direction: 'up' | 'down' | null };
    hp: { status: 'match' | 'close' | 'far'; direction: 'up' | 'down' | null };
    torque: { status: 'match' | 'close' | 'far'; direction: 'up' | 'down' | null };
    weight: { status: 'match' | 'close' | 'far'; direction: 'up' | 'down' | null };
  };
}

export type CarTypeFilter = 'Road' | 'Race' | 'Tuner' | 'All';

export interface GameSettings {
  seed: string;
  carTypeFilter: CarTypeFilter;
}

export interface GameState {
  timeElapsed: number;
  tries: number;
  isWon: boolean;
  isRevealed: boolean;
  guesses: Guess[];
}

export interface CarData {
  cars: Car[];
  filteredCars: Car[];
  targetCar: Car | null;
}
