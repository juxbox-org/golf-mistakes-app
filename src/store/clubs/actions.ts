import { ActionContext } from 'vuex';
import { RootState } from '@/store/rootTypes.d';
import { FULL_SWING } from '@/store/consts';
import { ClubsState, Club } from './types.d';
import {
  ADD_CLUB,
  SAVE_CLUB,
  DELETE_CLUB,
} from './action-types';
import {
  INSERT_CLUB,
  INCREMENT_ID,
  REMOVE_CLUB,
  UPDATE_CLUB,
} from './mutation-types';

const actions = {
  [ADD_CLUB](context: ActionContext<ClubsState, RootState>, club: Club) {
    const swings = [
      {
        type: FULL_SWING,
        shortest: 0,
        longest: 0,
        average: 0,
        shots: 0,
      },
    ];

    context.commit(ADD_CLUB, {
      type: club.type,
      brand: club.brand,
      id: context.rootState.clubs.id,
      active: true,
      swings,
    });

    context.commit(INCREMENT_ID);
  },
  [SAVE_CLUB](context: ActionContext<ClubsState, RootState>, club: Club) {
    context.commit(UPDATE_CLUB, club);
  },
  [DELETE_CLUB](context: ActionContext<ClubsState, RootState>, id: number) {
    context.commit(DELETE_CLUB, id);
  },
};

export default actions;
