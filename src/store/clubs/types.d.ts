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
  archived?: boolean;
}

export interface Swing {
  type: number;
  shortest?: number;
  longest?: number;
  average?: number;
  shots?: number;
}

export interface SwingData<T> {
  club: number;
  swing?: number;
  value?: T;
}
