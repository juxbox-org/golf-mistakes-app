declare interface View {
  summary: string;
  track: string;
  review: string;
}

export interface ViewData {
  view: string;
  type: string;
}

export interface RootState {
  version: number;
  screen: string;
  view: View;
}
