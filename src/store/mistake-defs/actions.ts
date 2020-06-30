import { ActionContext } from 'vuex';
import { RootState } from '@/store/rootTypes.d';
import { RoundData, Round } from '@/store/rounds/types.d';
import { RESULTS_MAP } from '@/store/consts';
import {
  CREATE_MISTAKE,
  CREATE_CATEGORY,
  SAVE_MISTAKE,
  DELETE_MISTAKE,
  DELETE_CATEGORY,
  UPDATE_ALL_SHOTS,
  UPDATE_STATS,
  DELETE_STATS,
} from './action-types';
import {
  INSERT_MISTAKE,
  INSERT_CATEGORY,
  UPDATE_MISTAKE,
  REMOVE_MISTAKE,
  REMOVE_CATEGORY,
  INCREMENT_ID,
  UPDATE_SHOTS_FOR_SHOTTYPE,
  UPDATE_MISTAKES_FOR_SHOTTYPE,
  REMOVE_MISTAKE_FOR_SHOTTYPE,
  REMOVE_SHOT_FOR_SHOTTYPE,
  UPDATE_RESULTS_FOR_SHOTTYPE,
  REMOVE_RESULT_FOR_SHOTTYPE,
  INSERT_MISTAKE_DETAILS,
  UPDATE_MISTAKE_DETAILS,
} from './mutation-types';
import { MistakeDefsState, MistakeRecord } from './types.d';

interface IndexableResults {
  [key: string]: number;
}
const actions = {
  [CREATE_MISTAKE](context: ActionContext<MistakeDefsState, RootState>,
    mistakeData: MistakeRecord) {
    const results = {};

    RESULTS_MAP.forEach((value, key) => {
      (results as IndexableResults)[key] = 0;
    });

    const mistakeId = context.rootState.mistakeDefs.id;

    context.commit(INSERT_MISTAKE, {
      ...mistakeData.mistakeDef,
      id: mistakeId,
    });

    context.commit(INSERT_MISTAKE_DETAILS, {
      ...mistakeData.mistakeDetails,
      date: new Date().toISOString(),
      mistakeId,
      totalShots: 0,
      totalMistakes: 0,
      results,
    });

    context.commit(INCREMENT_ID);
  },
  [CREATE_CATEGORY](context: ActionContext<MistakeDefsState, RootState>, name: string) {
    context.commit(INSERT_CATEGORY, { name, id: context.rootState.mistakeDefs.id });
    context.commit(INCREMENT_ID);
  },
  [SAVE_MISTAKE](context: ActionContext<MistakeDefsState, RootState>, mistakeData: MistakeRecord) {
    context.commit(UPDATE_MISTAKE, { ...mistakeData.mistakeDef });

    if (mistakeData.updateDetailsVersion) {
      const results = {};

      RESULTS_MAP.forEach((value, key) => {
        (results as IndexableResults)[key] = 0;
      });

      context.commit(INSERT_MISTAKE_DETAILS, {
        ...mistakeData.mistakeDetails,
        date: new Date().toISOString(),
        mistakeId: mistakeData.mistakeDef.id,
        totalShots: 0,
        totalMistakes: 0,
        results,
      });
    } else {
      context.commit(UPDATE_MISTAKE_DETAILS, mistakeData.mistakeDetails);
    }
  },
  [DELETE_MISTAKE](context: ActionContext<MistakeDefsState, RootState>, id: number) {
    context.commit(REMOVE_MISTAKE, id);
  },
  [DELETE_CATEGORY](context: ActionContext<MistakeDefsState, RootState>, id: number) {
    context.commit(REMOVE_CATEGORY, id);
  },
  [UPDATE_ALL_SHOTS](context: ActionContext<MistakeDefsState, RootState>) {
    const { rounds } = context.rootState.rounds;

    rounds.forEach((round) => {
      round.holes.forEach((hole) => {
        hole.shots.forEach((shot) => {
          context.commit(UPDATE_SHOTS_FOR_SHOTTYPE, shot.type);

          if (shot.mistake) {
            context.commit(UPDATE_MISTAKES_FOR_SHOTTYPE, shot.type);
          }
        });
      });
    });
  },
  [UPDATE_STATS](context: ActionContext<MistakeDefsState, RootState>, round: RoundData) {
    round.holes.forEach((hole) => {
      if (hole.par) {
        hole.shots.forEach((shot) => {
          if (shot.mistake) {
            context.commit(UPDATE_MISTAKES_FOR_SHOTTYPE, shot.shotId);
            context.commit(UPDATE_RESULTS_FOR_SHOTTYPE,
              { shotId: shot.shotId, result: shot.result });
          }

          context.commit(UPDATE_SHOTS_FOR_SHOTTYPE, shot.shotId);
        });
      }
    });
  },
  [DELETE_STATS](context: ActionContext<MistakeDefsState, RootState>, round: Round) {
    round.holes.forEach((hole) => {
      if (hole.par) {
        hole.shots.forEach((shot) => {
          if (shot.mistake) {
            context.commit(REMOVE_MISTAKE_FOR_SHOTTYPE, shot.shotId);
            context.commit(REMOVE_RESULT_FOR_SHOTTYPE,
              { shotId: shot.shotId, result: shot.result });
          }

          context.commit(REMOVE_SHOT_FOR_SHOTTYPE, shot.shotId);
        });
      }
    });
  },
};

export default actions;
