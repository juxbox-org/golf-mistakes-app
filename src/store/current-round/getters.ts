/* eslint-disable operator-linebreak */
import { RootState } from '@/store/rootTypes.d';
import { GetterTree } from 'vuex';
import { getRoundDetails, isPutt } from '@/store/helpers/rounds';
import { Round } from '@/store/rounds/types.d';
import { CurrentRoundState } from './types.d';
import {
  IN_PROGRESS,
  CURRENT_HOLE,
  IS_ADDING_MISTAKE,
  HOLES,
  PAR_CURRENT_HOLE,
  MISTAKES_FOR_HOLE,
  COURSE_DETAILS,
  ROUND_DETAILS,
  PUTTS_FOR_HOLE,
  PENALTIES_FOR_HOLE,
  IS_EDITING_HOLE,
} from './getter-types';

const getters = {
  [IN_PROGRESS](state: CurrentRoundState) {
    return state.inProgress;
  },
  [CURRENT_HOLE](state: CurrentRoundState) {
    return state.currentHole;
  },
  [IS_ADDING_MISTAKE](state: CurrentRoundState) {
    return state.isAddingShot;
  },
  [HOLES](state: CurrentRoundState) {
    return state.holes;
  },
  [PAR_CURRENT_HOLE](state: CurrentRoundState) {
    const hole = state.holes[state.currentHole - 1];

    if (!hole) {
      throw Error(`No hole exists for hole: ${state.currentHole}`);
    }

    return hole.par;
  },
  [MISTAKES_FOR_HOLE](state: CurrentRoundState) {
    const hole = state.holes[state.currentHole - 1];

    if (!hole) {
      throw Error(`No hole exists for hole: ${state.currentHole}`);
    }

    let numMistakes = 0;

    hole.shots.forEach((shot) => {
      if (shot.mistake) {
        numMistakes += 1;
      }
    });

    return numMistakes;
  },
  [PENALTIES_FOR_HOLE](state: CurrentRoundState) {
    const hole = state.holes[state.currentHole - 1];

    if (!hole) {
      throw Error(`No hole exists for hole: ${state.currentHole}`);
    }

    let numPenalties = 0;

    hole.shots.forEach((shot) => {
      if (shot.addPenalty) {
        numPenalties += 1;
      }
    });

    return numPenalties;
  },
  [COURSE_DETAILS](state: CurrentRoundState) {
    return {
      course: state.course,
      date: state.date,
      slope: state.slope,
      rating: state.rating,
      tees: state.tees,
    };
  },
  [ROUND_DETAILS](state: CurrentRoundState,
    currentRoundGetters: GetterTree<CurrentRoundState, RootState>, rootState: RootState) {
    return getRoundDetails(state as Round, rootState.mistakeDefs);
  },
  [PUTTS_FOR_HOLE](state: CurrentRoundState,
    currentRoundGetters: GetterTree<CurrentRoundState, RootState>, rootState: RootState) {
    const mistakeDefsState = rootState.mistakeDefs;
    const currentHole = state.holes[state.currentHole - 1];

    let totalPutts = 0;

    currentHole.shots.forEach((shot) => {
      if (isPutt(shot.shotId, mistakeDefsState)) {
        totalPutts += 1;
      }
    });

    return totalPutts;
  },
  [IS_EDITING_HOLE](state: CurrentRoundState) {
    return state.isEditingHole;
  },
};
export default getters;
