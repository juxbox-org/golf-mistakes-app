import Vue from 'vue';
import {
  INSERT_CLUB,
  INCREMENT_ID,
  UPDATE_CLUB,
  REMOVE_CLUB,
  INIT_SWINGS,
  UPDATE_SWING_SHORTEST,
  UPDATE_SWING_LONGEST,
  UPDATE_SWING_AVERAGE,
  UPDATE_SWING_SHOTS,
  ADD_NEW_SWING,
} from './mutation-types';
import {
  ClubsState,
  Club,
  SwingData,
  Swing,
} from './types.d';

const mutations = {
  [INSERT_CLUB](state: ClubsState, club: Club) {
    state.clubs.push(club);
  },
  [UPDATE_CLUB](state: ClubsState, club: Club) {
    const index = state.clubs.findIndex((item) => item.id === club.id);

    if (index < 0) {
      throw Error(`UPDATE_CLUB: Unable to find club with id: ${club.id}`);
    }

    Vue.set(state.clubs, index, club);
  },
  [REMOVE_CLUB](state: ClubsState, id: number) {
    const index = state.clubs.findIndex((item) => item.id === id);

    if (index < 0) {
      throw Error(`REMOVE_CLUB: Unable to find club with id: ${id}`);
    }

    const club = state.clubs[index];
    club.archived = true;

    Vue.set(state.clubs, index, club);
  },
  [INCREMENT_ID](state: ClubsState) {
    state.id += 1;
  },
  [INIT_SWINGS](state: ClubsState, id: number) {
    const club = state.clubs.find((item) => item.id === id);

    if (!club) {
      throw Error(`INIT_SWINGS: Unable to find club with id: ${id}`);
    }

    club.swings = [];
  },
  [UPDATE_SWING_SHORTEST](state: ClubsState, data: SwingData<number>) {
    const club = state.clubs.find((item) => item.id === data.club);

    if (!club) {
      throw Error(`UPDATE_SWING_SHORTEST: Unable to find club with id: ${data.club}`);
    }

    const swing = club.swings.find((item) => item.type === data.swing);

    if (!swing) {
      throw Error(`UPDATE_SWING_SHORTEST: Unable to find swing with type: ${data.swing}`);
    }

    swing.shortest = data.value;
  },
  [UPDATE_SWING_LONGEST](state: ClubsState, data: SwingData<number>) {
    const club = state.clubs.find((item) => item.id === data.club);

    if (!club) {
      throw Error(`UPDATE_SWING_LONGEST: Unable to find club with id: ${data.club}`);
    }

    const swing = club.swings.find((item) => item.type === data.swing);

    if (!swing) {
      throw Error(`UPDATE_SWING_LONGEST: Unable to find swing with type: ${data.swing}`);
    }

    swing.longest = data.value;
  },
  [UPDATE_SWING_AVERAGE](state: ClubsState, data: SwingData<number>) {
    const club = state.clubs.find((item) => item.id === data.club);

    if (!club) {
      throw Error(`UPDATE_SWING_AVERAGE: Unable to find club with id: ${data.club}`);
    }

    const swing = club.swings.find((item) => item.type === data.swing);

    if (!swing) {
      throw Error(`UPDATE_SWING_AVERAGE: Unable to find swing with type: ${data.swing}`);
    }

    swing.average = data.value;
  },
  [UPDATE_SWING_SHOTS](state: ClubsState, data: SwingData<number>) {
    const club = state.clubs.find((item) => item.id === data.club);

    if (!club) {
      throw Error(`UPDATE_SWING_SHOTS: Unable to find club with id: ${data.club}`);
    }

    const swing = club.swings.find((item) => item.type === data.swing);

    if (!swing) {
      throw Error(`UPDATE_SWING_SHOTS: Unable to find swing with type: ${data.swing}`);
    }

    swing.shots += 1;
  },
  [ADD_NEW_SWING](state: ClubsState, data: SwingData<Swing>) {
    const club = state.clubs.find((item) => item.id === data.club);

    if (!club) {
      throw Error(`UPDATE_SWING_SHOTS: Unable to find club with id: ${data.club}`);
    }

    club.swings.push(data.value);
  },
};

export default mutations;
