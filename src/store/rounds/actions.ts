/* eslint-disable operator-linebreak */
import { ActionContext } from 'vuex';
import { RootState } from '@/store/rootTypes.d';
import { SAVE_ROUND } from './action-types';
import { INSERT_ROUND } from './mutation-types';
import {
  RoundState,
  RoundData,
  RoundShot,
  RoundHole,
} from './types.d';

const actions = {
  [SAVE_ROUND](context: ActionContext<RoundState, RootState>, roundData: RoundData) {
    const shotTypesState = context.rootState.mistakeDefs;

    const round = {
      course: roundData.course,
      date: roundData.date,
      holes: [] as Array<RoundHole>,
    };

    roundData.holes.forEach((hole) => {
      if (hole.par) {
        const roundHole = {
          id: hole.id,
          par: hole.par,
          shots: [] as Array<RoundShot>,
        };

        hole.shots.forEach((shot) => {
          const shotType = shotTypesState.mistakeDefs.find((item) => item.id === shot.shotId);
          const category =
            shotTypesState.shotCategories.find((item) => item.id === shotType.categoryId);

          roundHole.shots.push({
            type: shotType.title,
            desc: shotType.desc,
            category: category.name,
            mistake: shot.mistake,
          });
        });

        round.holes.push(roundHole);
      }
    });

    context.commit(INSERT_ROUND, round);
  },
};

export default actions;
