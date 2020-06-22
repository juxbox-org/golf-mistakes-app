export interface ClubsState {
  id: number;
  clubs: Array<Club>;
}

export interface Club {
  id?: number;
  type: string;
  brand?: string;
  active: boolean;
  swings?: Array<Swing>;
}

export interface Swing {
  type: number;
  shortest?: number;
  longest?: number;
  average?: number;
  shots?: number;
}
