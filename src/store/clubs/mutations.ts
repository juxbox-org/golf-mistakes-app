import {
  INSERT_CLUB,
  INCREMENT_ID,
  UPDATE_CLUB,
  REMOVE_CLUB,
} from './mutation-types';
import { ClubsState, Club } from './types.d';

const mutations = {
  [INSERT_CLUB](state: ClubsState, club: Club) {
    state.clubs.push(club);
  },
  [UPDATE_CLUB](state: ClubsState, club: Club) {
    const index = state.clubs.findIndex((item) => item.id === club.id);

    if (index < 0) {
      throw Error(`UPDATE_CLUB: Unable to find club with id: ${club.id}`);
    }

    state.clubs[index] = club;
  },
  [REMOVE_CLUB](state: ClubsState, id: number) {
    const index = state.clubs.findIndex((item) => item.id === id);

    if (index < 0) {
      throw Error(`DELETE_CLUB: Unable to find club with id: ${id}`);
    }

    state.clubs.splice(index, 1);
  },
  [INCREMENT_ID](state: ClubsState) {
    state.id += 1;
  },
};

export default mutations;
