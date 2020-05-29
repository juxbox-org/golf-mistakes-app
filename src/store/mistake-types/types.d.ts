/*
 * Declare typescript types for mistake-types Vuex module
 */
export interface MistakeType {
  title: string;
  desc: string;
}

export interface MistakeTypesState {
  mistakeTypes: Map<number, MistakeType>;
}

export interface MistakeRecord {
  id: number;
  data: MistakeType;
}

// Action function types
export interface CreateMistakeAction {
  (mistakeData: MistakeType): Promise<void>;
}
