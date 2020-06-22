import { CLUBS } from './getter-types';
import { ClubsState } from './types.d';

const getters = {
  [CLUBS](state: ClubsState) {
    return state.clubs;
  },
};

export default getters;
