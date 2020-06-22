export interface RoundState {
  rounds: Array<Round>;
  currentOverviewTab: string;
  hasUpdated: boolean;
  id: number;
}

export interface Round {
  id: number;
  course: string;
  date: string;
  rating?: number;
  slope?: number;
  tees?: string;
  totalMistakes: number;
  totalShots: number;
  totalPenalties: number;
  totalPutts: number;
  par: number;
  holes: Array<RoundHole>;
}

export interface RoundHole {
  id: number;
  par: number;
  shots: Array<RoundShot>;
}

export interface RoundShot {
  shotId: number;
  categoryId: number;
  // Add category and shot info to avoid lookups when possible
  type?: string;
  desc?: string;
  category?: string;
  mistake: boolean;
  addPenalty: boolean;
  result?: number;
  club?: number;
  distance?: number;
  swing?: number;
}

export interface RoundData {
  course: string;
  date: string;
  holes: Array<RoundHole>;
  rating?: number;
  slope?: number;
  tees?: string;
}

// Action function types
export interface CreateRoundAction {
  (roundData: RoundData): Promise<void>;
}
