import _ from 'lodash';
import { ActionContext } from 'vuex';
import { RootState } from '@/store/rootTypes.d';
import { Round, RoundHole, RoundShot } from '@/store/rounds/types.d';
import { ClubsState, Club, Swing } from './types.d';
import {
  ADD_CLUB,
  SAVE_CLUB,
  DELETE_CLUB,
  UPDATE_CLUB_STATS,
} from './action-types';
import {
  INSERT_CLUB,
  INCREMENT_ID,
  REMOVE_CLUB,
  UPDATE_CLUB,
  UPDATE_SWING_SHOTS,
  UPDATE_SWING_AVERAGE,
  UPDATE_SWING_LONGEST,
  UPDATE_SWING_SHORTEST,
  ADD_NEW_SWING,
  INIT_SWINGS,
} from './mutation-types';

const actions = {
  [ADD_CLUB](context: ActionContext<ClubsState, RootState>, club: Club) {
    const swings: Array<Swing> = [];

    context.commit(INSERT_CLUB, {
      type: club.type,
      brand: club.brand,
      id: context.rootState.clubs.id,
      active: true,
      swings,
    });

    context.commit(INCREMENT_ID);
  },
  [SAVE_CLUB](context: ActionContext<ClubsState, RootState>, club: Club) {
    context.commit(UPDATE_CLUB, club);
  },
  [DELETE_CLUB](context: ActionContext<ClubsState, RootState>, id: number) {
    context.commit(REMOVE_CLUB, id);
  },
  [UPDATE_CLUB_STATS](context: ActionContext<ClubsState, RootState>, round: Round) {
    round.holes.forEach((hole: RoundHole) => {
      hole.shots.forEach((shot: RoundShot) => {
        if (!_.isNil(shot.club) && !_.isNil(shot.swing) && shot.distance) {
          const club = context.rootState.clubs.clubs.find((item) => item.id === shot.club);

          if (club.swings) {
            const swing = club.swings.find((item) => item.type === shot.swing);
            if (swing) {
              if (!swing.shortest || swing.shortest > shot.distance) {
                context.commit(UPDATE_SWING_SHORTEST, {
                  club: club.id,
                  swing: swing.type,
                  value: shot.distance,
                });
              } else if (swing.longest < shot.distance) {
                context.commit(UPDATE_SWING_LONGEST, {
                  club: club.id,
                  swing: swing.type,
                  value: shot.distance,
                });
              }

              const average =
                Math.round((shot.distance + (swing.shots * swing.average)) / (swing.shots + 1));

              context.commit(UPDATE_SWING_AVERAGE, {
                club: club.id,
                swing: swing.type,
                value: average,
              });

              context.commit(UPDATE_SWING_SHOTS, {
                club: club.id,
                swing: swing.type,
              });
            } else {
              context.commit(ADD_NEW_SWING, {
                club: club.id,
                value: {
                  type: shot.swing,
                  average: shot.distance,
                  shortest: shot.distance,
                  longest: shot.distance,
                  shots: 1,
                },
              });
            }
          } else {
            context.commit(INIT_SWINGS, club.id);

            context.commit(ADD_NEW_SWING, {
              club: club.id,
              value: {
                type: shot.swing,
                average: shot.distance,
                shortest: shot.distance,
                longest: shot.distance,
                shots: 1,
              },
            });
          }
        }
      });
    });
  },
};

export default actions;
