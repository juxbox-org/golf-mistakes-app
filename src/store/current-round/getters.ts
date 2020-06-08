import { CurrentRoundState, Shot } from './types.d';
import {
  IN_PROGRESS,
  CURRENT_HOLE,
  IS_ADDING_MISTAKE,
  HOLES,
  PAR_CURRENT_HOLE,
  MISTAKES_FOR_HOLE,
  COURSE_DETAILS,
  ROUND_DETAILS,
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

    return hole.shots.reduce((acc: Array<number>, shot: Shot, index: number): Array<number> => {
      if (shot.mistake) {
        acc.push(index);
      }

      return acc;
    }, []);
  },
  [COURSE_DETAILS](state: CurrentRoundState) {
    return {
      course: state.course,
      date: state.date,
    };
  },
  [ROUND_DETAILS](state: CurrentRoundState) {
    let totalShots = 0;
    let totalMistakes = 0;
    let parForHolesPlayed = 0;

    state.holes.forEach((hole) => {
      /*
       * Only count holes that have a par and have
       * shots that have been played
       */
      if (hole.shots.length && hole.par) {
        parForHolesPlayed += hole.par;
      }

      hole.shots.forEach((shot) => {
        if (shot.mistake) {
          totalMistakes += 1;
        }

        totalShots += 1;
      });
    });

    return {
      shots: totalShots,
      mistakes: totalMistakes,
      score: parForHolesPlayed ? (totalShots - parForHolesPlayed) : 0,
    };
  },
};

export default getters;
