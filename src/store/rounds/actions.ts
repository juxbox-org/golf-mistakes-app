import { ActionContext } from 'vuex';
import { RootState } from '@/store/rootTypes.d';
import { CREATE_ROUND } from './action-types';
import { INSERT_ROUND } from './mutation-types';
import { RoundsState, RoundType } from './types.d';

let id = 0;

const actions = {
  [CREATE_ROUND](context: ActionContext<RoundsState, RootState>, roundData: RoundType) {
    const payload = {
      id,
      data: roundData,
    };

    context.commit(INSERT_ROUND, payload);
    id += 1;
  },
};

export default actions;
