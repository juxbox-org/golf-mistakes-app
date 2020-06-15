export interface RoundState {
  rounds: Array<Round>;
  currentOverviewTab: string;
  hasUpdated: boolean;
}

export interface Round {
  course: string;
  date: string;
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
}

export interface RoundData {
  course: string;
  date: string;
  holes: Array<RoundHole>;
}

// Action function types
export interface CreateRoundAction {
  (roundData: RoundData): Promise<void>;
}
