/*
 * Declare typescript types for mistake-types Vuex module
 */
export interface MistakeDef {
  id?: number; // this is the DB ID
  title: string;
  desc: string;
  categoryId?: number;
}

export interface ShotCategory {
  id?: number;
  name: string;
}

export interface MistakeDefsState {
  mistakeDefs: Array<MistakeDef>;
  shotCategories: Array<ShotCategory>;
}

export interface MistakeRecord {
  id: number;
  data: MistakeDef;
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
