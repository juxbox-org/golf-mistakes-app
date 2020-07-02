/* eslint-disable operator-linebreak */
import { ActionContext } from 'vuex';
import { RootState } from '@/store/rootTypes.d';
import { SAVE_ROUND, DELETE_ROUND } from './action-types';
import { INSERT_ROUND, INCREMENT_ID, REMOVE_ROUND } from './mutation-types';
import {
  RoundState,
  RoundData,
  RoundShot,
  RoundHole,
  Round,
} from './types.d';
import { getDetailsForShot } from '../mistake-defs/getters';

const PUTT_CATEGORY_ID = 0;

const actions = {
  [SAVE_ROUND](context: ActionContext<RoundState, RootState>, roundData: RoundData) {
    const shotTypesState = context.rootState.mistakeDefs;

    const round = {
      id: context.rootState.rounds.id,
      course: roundData.course,
      date: roundData.date,
      holes: [] as Array<RoundHole>,
      totalShots: 0,
      totalMistakes: 0,
      totalPutts: 0,
      totalPenalties: 0,
      par: 0,
    } as Round;

    context.commit(INCREMENT_ID);

    if (roundData.slope) {
      round.slope = roundData.slope;
    }

    if (roundData.rating) {
      round.rating = roundData.rating;
    }

    if (roundData.tees) {
      round.tees = roundData.tees;
    }

    roundData.holes.forEach((hole) => {
      /*
       * If the hole doesn't have a par set, don't count the shots, since it's
       * likely the hole wasn't completed
       */
      if (hole.par) {
        const roundHole = {
          id: hole.id,
          par: hole.par,
          shots: [] as Array<RoundShot>,
        };

        round.par += hole.par;

        hole.shots.forEach((shot) => {
          const shotType =
            shotTypesState.mistakeDefs.find((item) => item.id === shot.shotId);
          const category =
            shotTypesState.shotCategories.find((item) => item.id === shotType.categoryId);
          const shotDetails = getDetailsForShot(shot.shotId, shotTypesState.mistakeDetails);

          roundHole.shots.push({
            shotId: shot.shotId,
            type: shotType.title,
            desc: shotDetails.desc,
            categoryId: category.id,
            category: category.name,
            mistake: shot.mistake,
            addPenalty: shot.addPenalty,
            result: shot.result || null,
            swing: shot.swing || null,
            club: shot.club || null,
            distance: shot.distance || null,
          });

          round.totalShots += 1;

          if (shot.mistake) {
            round.totalMistakes += 1;
          }

          if (shot.addPenalty) {
            round.totalPenalties += 1;
          }

          if (category.id === PUTT_CATEGORY_ID) {
            round.totalPutts += 1;
          }
        });

        round.holes.push(roundHole);
      }
    });

    context.commit(INSERT_ROUND, round);
  },
  [DELETE_ROUND](context: ActionContext<RoundState, RootState>, round: Round) {
    context.commit(REMOVE_ROUND, round);
  },
};

export default actions;
