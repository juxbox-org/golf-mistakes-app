/* eslint-disable operator-linebreak */
import { RootState } from '@/store/rootTypes.d';
import { GetterTree } from 'vuex';
import { getRoundDetails, isPutt } from '@/store/helpers/rounds';
import { Round, RoundShot, RoundHole } from '@/store/rounds/types.d';
import {
  isGir,
  isPar,
  isBirdie,
  isEagleOrBetter,
  isBogey,
  isDoubleBogey,
  isTripleBogeyOrWorse,
} from '@/store/helpers/scoring';
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
  SHOTS_WITH_CATEGORIES,
  SCORING_SUMMARY,
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
  [SHOTS_WITH_CATEGORIES](state: CurrentRoundState,
    currentRoundGetters: GetterTree<CurrentRoundState, RootState>, rootState: RootState) {
    const mistakeDefsState = rootState.mistakeDefs;
    const index = state.currentHole - 1;

    return state.holes[index].shots.map((shot: RoundShot, shotIndex: number) => {
      const shotType = mistakeDefsState.mistakeDefs.find((type) => type.id === shot.shotId);
      const shotCategory =
        mistakeDefsState.shotCategories.find((category) => category.id === shotType.categoryId);
      return {
        mistake: shot.mistake,
        penalty: shot.addPenalty,
        shotIndex,
        shotType,
        category: shotCategory.name,
        result: shot.result,
        swing: shot.swing,
        club: shot.club,
        distance: shot.distance,
      };
    });
  },
  [SCORING_SUMMARY](state: CurrentRoundState) {
    const summary = {
      gir: 0,
      par: 0,
      birdie: 0,
      eagle: 0,
      bogey: 0,
      double: 0,
      triple: 0,
    };

    state.holes.forEach((hole: RoundHole) => {
      if (hole.par) {
        if (isGir(hole)) summary.gir += 1;

        if (isPar(hole)) {
          summary.par += 1;
        } else if (isBirdie(hole)) {
          summary.birdie += 1;
        } else if (isEagleOrBetter(hole)) {
          summary.eagle += 1;
        } else if (isBogey(hole)) {
          summary.bogey += 1;
        } else if (isDoubleBogey(hole)) {
          summary.double += 1;
        } else if (isTripleBogeyOrWorse(hole)) {
          summary.triple += 1;
        }
      }
    });

    return summary;
  },
};
export default getters;
