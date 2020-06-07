import { CurrentRoundState } from './current-round/types.d';

declare interface Screen {
  summary: string;
  track: string;
  review: string;
}

export interface ScreenData {
  view: string;
  type: string;
}

export interface RootState {
  version: number;
  view: string;
  screen: Screen;
  currentRound?: CurrentRoundState;
}
