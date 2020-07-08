import { Results } from '@/store/mistake-defs/types.d';

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
  recordSwing?: boolean;
}

export interface RoundData {
  course: string;
  date: string;
  holes: Array<RoundHole>;
  rating?: number;
  slope?: number;
  tees?: string;
}

export interface CategoryStat {
  categoryName: string;
  totalShots: number;
  totalMistakes: number;
  averageMistakes?: number;
  results?: Map<string, number>;
}

export interface CategorySummary {
  course: string;
  date: string;
  stats: Array<CategoryStat>;
}

// Action function types
export interface CreateRoundAction {
  (roundData: RoundData): Promise<void>;
}
