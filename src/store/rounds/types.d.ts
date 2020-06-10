import { Hole } from '@/store/current-round/types.d';

export interface RoundState {
  rounds: Array<Round>;
}

export interface Round {
  course: string;
  date: string;
  holes: Array<RoundHole>;
}

export interface RoundHole {
  id: number;
  shots: Array<RoundShot>;
}

export interface RoundShot {
  type: string;
  desc: string;
  category: string;
  mistake: boolean;
}

export interface RoundData {
  course: string;
  date: string;
  holes: Array<Hole>;
}

// Action function types
export interface CreateRoundAction {
  (roundData: RoundData): Promise<void>;
}
