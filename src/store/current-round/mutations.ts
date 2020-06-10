import {
  BEGIN_TRACKING,
  UPDATE_CURRENT_HOLE,
  STOP_ADDING_MISTAKE,
  START_ADDING_MISTAKE,
  ADD_SHOT_TO_HOLE,
  DELETE_SHOT_FROM_HOLE,
  ADD_PAR_TO_HOLE,
  ADD_MISTAKES_TO_HOLE,
  DELETE_ROUND,
  TOGGLE_PENALTY_FOR_HOLE,
} from './mutation-types';
import {
  CurrentRoundState,
  CurrentRoundRecord,
  Hole,
} from './types.d';

function initHoles(holes: Array<Hole>) {
  for (let i = 1; i <= 18; i += 1) {
    holes.push({ id: i, shots: [], par: null });
  }
}

const mutations = {
  [BEGIN_TRACKING](state: CurrentRoundState, roundData: CurrentRoundRecord) {
    state.course = roundData.course;
    state.date = roundData.date;
    state.currentHole = 1;
    state.inProgress = true;
    state.holes = [] as Array<Hole>;
    initHoles(state.holes);
  },
  [UPDATE_CURRENT_HOLE](state: CurrentRoundState, newHole: number) {
    state.currentHole = newHole;
  },
  [START_ADDING_MISTAKE](state: CurrentRoundState) {
    state.isAddingShot = true;
  },
  [STOP_ADDING_MISTAKE](state: CurrentRoundState) {
    state.isAddingShot = false;
  },
  [ADD_SHOT_TO_HOLE](state: CurrentRoundState, id: number) {
    const hole = state.holes[state.currentHole - 1];

    if (!hole) {
      throw Error(`No hole exists for hole: ${state.currentHole}`);
    }

    hole.shots.push({ shotId: id, mistake: false, addPenalty: false });

    state.isAddingShot = false;
  },
  [DELETE_SHOT_FROM_HOLE](state: CurrentRoundState, index: number) {
    const hole = state.holes[state.currentHole - 1];

    if (!hole) {
      throw Error(`No hole exists for hole: ${state.currentHole}`);
    }

    hole.shots.splice(index, 1);
  },
  [ADD_PAR_TO_HOLE](state: CurrentRoundState, par: number) {
    const hole = state.holes[state.currentHole - 1];

    if (par < 3 || par > 5) {
      throw Error(`Invalid par value: ${par}`);
    } else if (!hole) {
      throw Error(`No hole exists for hole: ${state.currentHole}`);
    }

    hole.par = par;
  },
  [ADD_MISTAKES_TO_HOLE](state: CurrentRoundState, shotIndex: number) {
    const hole = state.holes[state.currentHole - 1];

    if (!hole) {
      throw Error(`No hole exists for hole: ${state.currentHole}`);
    }

    hole.shots[shotIndex].mistake = !hole.shots[shotIndex].mistake;
  },
  [TOGGLE_PENALTY_FOR_HOLE](state: CurrentRoundState, shotIndex: number) {
    const hole = state.holes[state.currentHole - 1];

    if (!hole) {
      throw Error(`No hole exists for hole: ${state.currentHole}`);
    }

    hole.shots[shotIndex].addPenalty = !hole.shots[shotIndex].addPenalty;
  },
  [DELETE_ROUND](state: CurrentRoundState) {
    state.inProgress = false;
    state.isAddingShot = false;
    state.currentHole = 1;
    state.date = '';
    state.course = '';
    state.holes = [] as Array<Hole>;
    initHoles(state.holes);
  },
};

export default mutations;
