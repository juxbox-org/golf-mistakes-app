import { CurrentRoundState } from './current-round/types.d';
import { MistakeDefsState } from './mistake-defs/types.d';
import { RoundState } from './rounds/types.d';
import { ClubsState } from './clubs/types.d';

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
  currentRound?: CurrentRoundState;
  mistakeDefs?: MistakeDefsState;
  rounds?: RoundState;
  clubs?: ClubsState;
}
