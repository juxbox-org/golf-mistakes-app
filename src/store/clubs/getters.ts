import { CLUBS } from './getter-types';
import { ClubsState } from './types.d';

const getters = {
  [CLUBS](state: ClubsState) {
    return state.clubs.filter((club) => !club.archived);
  },
};

export default getters;
