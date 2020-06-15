import { ActionContext } from 'vuex';
import { RootState } from '@/store/rootTypes.d';
import {
  CREATE_MISTAKE,
  CREATE_CATEGORY,
  SAVE_MISTAKE,
  DELETE_MISTAKE,
  DELETE_CATEGORY,
  UPDATE_ALL_SHOTS,
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
} from './mutation-types';
import { MistakeDefsState, MistakeDef } from './types.d';

const actions = {
  [CREATE_MISTAKE](context: ActionContext<MistakeDefsState, RootState>, mistakeData: MistakeDef) {
    context.commit(INSERT_MISTAKE, { ...mistakeData, id: context.rootState.mistakeDefs.id });
    context.commit(INCREMENT_ID);
  },
  [CREATE_CATEGORY](context: ActionContext<MistakeDefsState, RootState>, name: string) {
    context.commit(INSERT_CATEGORY, { name, id: context.rootState.mistakeDefs.id });
    context.commit(INCREMENT_ID);
  },
  [SAVE_MISTAKE](context: ActionContext<MistakeDefsState, RootState>, mistakeData: MistakeDef) {
    context.commit(UPDATE_MISTAKE, mistakeData);
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
};

export default actions;
