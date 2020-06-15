import {
  INSERT_MISTAKE,
  INSERT_CATEGORY,
  UPDATE_MISTAKE,
  REMOVE_MISTAKE,
  REMOVE_CATEGORY,
  INCREMENT_ID,
  UPDATE_MISTAKES_FOR_SHOTTYPE,
  UPDATE_SHOTS_FOR_SHOTTYPE,
} from './mutation-types';
import { MistakeDefsState, MistakeDef, ShotCategory } from './types.d';

const PUTT_CATEGORY_ID = 0;

const mutations = {
  [INSERT_MISTAKE](state: MistakeDefsState, mistakeDef: MistakeDef) {
    state.mistakeDefs.push(mistakeDef);
  },
  [INSERT_CATEGORY](state: MistakeDefsState, categoryRecord: ShotCategory) {
    state.shotCategories.push(categoryRecord);
  },
  [UPDATE_MISTAKE](state: MistakeDefsState, mistakeDef: MistakeDef) {
    const shot = state.mistakeDefs.find((mistake) => mistake.id === mistakeDef.id);
    Object.assign(shot, {
      title: mistakeDef.title,
      desc: mistakeDef.desc,
      categoryId: mistakeDef.categoryId,
    });
  },
  [REMOVE_MISTAKE](state: MistakeDefsState, id: number) {
    const index = state.mistakeDefs.findIndex((mistake) => mistake.id === id);

    if (index >= 0) {
      state.mistakeDefs.splice(index, 1);
    }
  },
  [REMOVE_CATEGORY](state: MistakeDefsState, id: number) {
    // Don't delete Putt category, since we require it to track putts
    if (id === PUTT_CATEGORY_ID) {
      return;
    }

    const shotsToDelete: Array<number> = [];

    state.mistakeDefs.forEach((shotType, index) => {
      if (shotType.categoryId === id) {
        shotsToDelete.push(index);
      }
    });

    shotsToDelete.forEach((shotIndex) => {
      state.mistakeDefs.splice(shotIndex, 1);
    });

    const index = state.shotCategories.findIndex((category) => category.id === id);
    state.shotCategories.splice(index, 1);
  },
  [INCREMENT_ID](state: MistakeDefsState) {
    state.id += 1;
  },
  [UPDATE_MISTAKES_FOR_SHOTTYPE](state: MistakeDefsState, shotId: number) {
    const index = state.mistakeDefs.findIndex((item) => item.id === shotId);

    if (index < 0) {
      throw Error(`UPDATE_MISTAKES_FOR_SHOTTYPE: shot type doesn't exist for id: ${shotId}`);
    }

    const shot = state.mistakeDefs[index];

    /*
     * Guard against old versions not having totalMistakes initalized to zero
     */
    if (Number.isNaN(shot.totalMistakes)) {
      shot.totalMistakes = 0;
    }

    shot.totalMistakes += 1;
  },
  [UPDATE_SHOTS_FOR_SHOTTYPE](state: MistakeDefsState, shotId: number) {
    const index = state.mistakeDefs.findIndex((item) => item.id === shotId);

    if (index < 0) {
      throw Error(`UPDATE_SHOTS_FOR_SHOTTYPE: shot type doesn't exist for id: ${shotId}`);
    }

    const shot = state.mistakeDefs[index];

    /*
     * Guard against old versions not having totalShots initalized to zero
     */
    if (Number.isNaN(shot.totalShots)) {
      shot.totalShots = 0;
    }

    state.mistakeDefs[index].totalShots += 1;
  },
};

export default mutations;
