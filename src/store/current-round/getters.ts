/* eslint-disable operator-linebreak */
import { RootState } from '@/store/rootTypes.d';
import { GetterTree } from 'vuex';
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
} from './getter-types';
import { MistakeDefsState } from '../mistake-defs/types.d';

const PUTT_CATEGORY_ID = 0;

function isPutt(shotId: number, mistakeDefsState: MistakeDefsState): boolean {
  const shotType = mistakeDefsState.mistakeDefs.find((type) => type.id === shotId);

  const shotCategory =
    mistakeDefsState.shotCategories.find((category) => category.id === shotType.categoryId);

  return shotCategory.id === PUTT_CATEGORY_ID;
}

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
    };
  },
  [ROUND_DETAILS](state: CurrentRoundState,
    currentRoundGetters: GetterTree<CurrentRoundState, RootState>, rootState: RootState) {
    const mistakeDefsState = rootState.mistakeDefs;

    let totalShots = 0;
    let totalMistakes = 0;
    let totalPenalties = 0;
    let parForHolesPlayed = 0;
    let holesPlayed = 0;
    let totalPutts = 0;

    state.holes.forEach((hole) => {
      /*
       * Only count holes that have a par and have
       * shots that have been played
       */
      if (hole.shots.length && hole.par) {
        parForHolesPlayed += hole.par;
        holesPlayed += 1;
      }

      hole.shots.forEach((shot) => {
        if (shot.mistake) {
          totalMistakes += 1;
        }

        if (shot.addPenalty) {
          totalPenalties += 1;
        }

        if (isPutt(shot.shotId, mistakeDefsState)) {
          totalPutts += 1;
        }

        totalShots += 1;
      });
    });

    return {
      shots: totalShots,
      mistakes: totalMistakes,
      penalties: totalPenalties,
      score: parForHolesPlayed ? ((totalShots + totalPenalties) - parForHolesPlayed) : 0,
      holesPlayed,
      putts: totalPutts,
    };
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
};

export default getters;
