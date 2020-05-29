export interface RoundType {
  course: string;
  date: string;
  score?: number;
}

export interface RoundRecord {
  id: number;
  data: RoundType;
}

export interface RoundsState {
  rounds: Map<number, RoundType>;
}

// Action function types
export interface CreateRoundAction {
  (roundData: RoundType): Promise<void>;
}
