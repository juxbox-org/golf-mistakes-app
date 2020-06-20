/*
 * Declare typescript types for mistake-types Vuex module
 */
export interface MistakeDef {
  id?: number;
  title: string;
  desc: string;
  categoryId?: number;
  totalShots?: number;
  totalMistakes?: number;
  results?: Results;
}

export interface Results {
  slice?: number;
  hook?: number;
  thin?: number;
  fat?: number;
  top?: number;
  left?: number;
  right?: number;
  short?: number;
  long?: number;
  shank?: number;
}

export interface ShotCategory {
  id?: number;
  name: string;
}

export interface ShotCategoryWithSummary {
  id?: number;
  name: string;
  totalShots?: number;
  totalMistakes?: number;
  average?: number;
}

export interface MistakeDefsState {
  mistakeDefs: Array<MistakeDef>;
  shotCategories: Array<ShotCategory>;
  id: number;
}

export interface MistakeRecord {
  id: number;
  data: MistakeDef;
}

export interface ShotResult {
  shotId: number;
  result: number;
}

// Action function types
export interface CreateMistakeAction {
  (mistakeData: MistakeDef): Promise<void>;
}

export interface CreateCategoryAction {
  (name: string): Promise<void>;
}

export interface DeleteMistakeAction {
  (id: number): Promise<void>;
}
