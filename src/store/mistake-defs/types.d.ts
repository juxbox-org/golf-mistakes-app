/*
 * Declare typescript types for mistake-types Vuex module
 */
export interface MistakeDef {
  title: string;
  desc: string;
}

export interface MistakeDefsState {
  mistakeTypes: Map<number, MistakeDef>;
}

export interface MistakeRecord {
  id: number;
  data: MistakeDef;
}

// Action function types
export interface CreateMistakeAction {
  (mistakeData: MistakeDef): Promise<void>;
}
