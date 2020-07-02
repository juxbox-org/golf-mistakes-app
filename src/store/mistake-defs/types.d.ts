/*
 * Declare typescript types for mistake-types Vuex module
 */
export interface MistakeDef {
  id?: number;
  title: string;
  categoryId?: number;
  recordSwing?: boolean;
  archived?: boolean; // true if mistake definition should be archived
}

export interface MistakeDetails {
  mistakeId?: number; // reference to MistakeDef
  date?: string; // newest date = current version of details for a mistake
  desc: string;
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
  mistakeDetails: Array<MistakeDetails>;
  shotCategories: Array<ShotCategory>;
  currentEditingTab: string;
  id: number;
}

export interface MistakeRecord {
  mistakeDef: MistakeDef;
  mistakeDetails: MistakeDetails;
  updateDetailsVersion: boolean;
}

export interface ShotResult {
  shotId: number;
  result: number;
}

// Action function types
export interface CreateMistakeAction {
  (mistakeData: MistakeRecord): Promise<void>;
}

export interface CreateCategoryAction {
  (name: string): Promise<void>;
}

export interface DeleteMistakeAction {
  (id: number): Promise<void>;
}
