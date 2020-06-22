import { ActionContext } from 'vuex';
import { RootState } from '@/store/rootTypes.d';
import { ClubsState, Club } from './types.d';
import { ADD_CLUB } from './action-types';
import { INCREMENT_ID } from './mutation-types';

const actions = {
  [ADD_CLUB](context: ActionContext<ClubsState, RootState>, club: Club) {
    context.commit(ADD_CLUB, {
      type: club.type,
      brand: club.brand,
      id: context.rootState.clubs.id,
    });

    context.commit(INCREMENT_ID);
  },
};

export default actions;
