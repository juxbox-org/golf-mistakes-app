import { ActionContext } from 'vuex';
import { RootState } from '@/store/rootTypes.d';
import {
  CREATE_MISTAKE,
  CREATE_CATEGORY,
  SAVE_MISTAKE,
  DELETE_MISTAKE,
  DELETE_CATEGORY,
} from './action-types';
import {
  INSERT_MISTAKE,
  INSERT_CATEGORY,
  UPDATE_MISTAKE,
  REMOVE_MISTAKE,
  REMOVE_CATEGORY,
  INCREMENT_ID,
} from './mutation-types';
import { MistakeDefsState, MistakeDef } from './types.d';

const actions = {
  [CREATE_MISTAKE](context: ActionContext<MistakeDefsState, RootState>, mistakeData: MistakeDef) {
    context.commit(INSERT_MISTAKE, { ...mistakeData, id: context.rootState.mistakeDefs.id });
    context.commit(INCREMENT_ID);
  },
  [CREATE_CATEGORY](context: ActionContext<MistakeDefsState, RootState>, name: string) {
    context.commit(INSERT_CATEGORY, { name, id: context.rootState.mistakeDefs.id });
    context.commit(INCREMENT_ID);
  },
  [SAVE_MISTAKE](context: ActionContext<MistakeDefsState, RootState>, mistakeData: MistakeDef) {
    context.commit(UPDATE_MISTAKE, mistakeData);
  },
  [DELETE_MISTAKE](context: ActionContext<MistakeDefsState, RootState>, id: number) {
    context.commit(REMOVE_MISTAKE, id);
  },
  [DELETE_CATEGORY](context: ActionContext<MistakeDefsState, RootState>, id: number) {
    context.commit(REMOVE_CATEGORY, id);
  },
};

export default actions;
