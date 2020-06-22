export interface ClubsState {
  id: number;
  clubs: Array<Club>;
}

export interface Club {
  id?: number;
  type: string;
  brand?: string;
  shortest?: number;
  longest?: number;
  distance?: number;
}
