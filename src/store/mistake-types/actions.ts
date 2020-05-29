import { ActionContext } from 'vuex';
import { RootState } from '@/store/rootTypes.d';
import { CREATE_MISTAKE } from './action-types';
import { INSERT_MISTAKE } from './mutation-types';
import { MistakeTypesState, MistakeType } from './types.d';

let id = 0;

const actions = {
  [CREATE_MISTAKE](context: ActionContext<MistakeTypesState, RootState>, mistakeData: MistakeType) {
    const payload = {
      id,
      data: mistakeData,
    };

    context.commit(INSERT_MISTAKE, payload);
    id += 1;
  },
};

export default actions;
