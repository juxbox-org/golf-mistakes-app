/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
import { ActionContext } from 'vuex';
import { RootState } from '@/store/rootTypes.d';
import {
  CREATE_MISTAKE,
  CREATE_CATEGORY,
  SAVE_MISTAKE,
  DELETE_MISTAKE,
} from './action-types';
import {
  INSERT_MISTAKE,
  INSERT_CATEGORY,
  UPDATE_MISTAKE,
  REMOVE_MISTAKE,
} from './mutation-types';
import { MistakeDefsState, MistakeDef } from './types.d';

let _id = 1;

const actions = {
  [CREATE_MISTAKE](context: ActionContext<MistakeDefsState, RootState>, mistakeData: MistakeDef) {
    context.commit(INSERT_MISTAKE, { ...mistakeData, id: _id });
    _id += 1;
  },
  [CREATE_CATEGORY](context: ActionContext<MistakeDefsState, RootState>, name: string) {
    context.commit(INSERT_CATEGORY, { name, id: _id });
    _id += 1;
  },
  [SAVE_MISTAKE](context: ActionContext<MistakeDefsState, RootState>, mistakeData: MistakeDef) {
    context.commit(UPDATE_MISTAKE, mistakeData);
  },
  [DELETE_MISTAKE](context: ActionContext<MistakeDefsState, RootState>, id: number) {
    context.commit(REMOVE_MISTAKE, id);
  },
};

export default actions;
