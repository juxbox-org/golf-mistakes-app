import Vue from 'vue';
import { RESULTS_MAP } from '@/store/consts';
import { getKeysForResult } from '@/store/helpers/results';
import {
  INSERT_MISTAKE,
  INSERT_CATEGORY,
  UPDATE_MISTAKE,
  REMOVE_MISTAKE,
  REMOVE_CATEGORY,
  INCREMENT_ID,
  UPDATE_MISTAKES_FOR_SHOTTYPE,
  UPDATE_SHOTS_FOR_SHOTTYPE,
  REMOVE_MISTAKE_FOR_SHOTTYPE,
  REMOVE_SHOT_FOR_SHOTTYPE,
  UPDATE_RESULTS_FOR_SHOTTYPE,
  REMOVE_RESULT_FOR_SHOTTYPE,
  UPDATE_EDITING_TAB,
  INSERT_MISTAKE_DETAILS,
  UPDATE_MISTAKE_DETAILS,
} from './mutation-types';
import {
  MistakeDefsState,
  MistakeDef,
  ShotCategory,
  ShotResult,
  MistakeDetails,
} from './types.d';
import {
  getDetailsForShot,
  getIndexForShotDetails,
} from './getters';

interface IndexableResults {
  [key: string]: number;
}

const PUTT_CATEGORY_ID = 0;

const mutations = {
  [INSERT_MISTAKE](state: MistakeDefsState, mistakeDef: MistakeDef) {
    state.mistakeDefs.push(mistakeDef);
  },
  [INSERT_MISTAKE_DETAILS](state: MistakeDefsState, details: MistakeDetails) {
    state.mistakeDetails.push(details);
  },
  [INSERT_CATEGORY](state: MistakeDefsState, categoryRecord: ShotCategory) {
    state.shotCategories.push(categoryRecord);
  },
  [UPDATE_MISTAKE](state: MistakeDefsState, mistakeDef: MistakeDef) {
    const shot = state.mistakeDefs.find((mistake) => mistake.id === mistakeDef.id);
    Object.assign(shot, {
      title: mistakeDef.title,
      categoryId: mistakeDef.categoryId,
      recordSwing: mistakeDef.recordSwing,
    });
  },
  [UPDATE_MISTAKE_DETAILS](state: MistakeDefsState, details: MistakeDetails) {
    const mistakeDetails = state.mistakeDetails.find((item) =>
      item.mistakeId === details.mistakeId && item.date === details.date);

    if (!mistakeDetails) {
      throw Error('UPDATE_MISTAKE_DETAILS: Unable to find matching details for id: '
        + `${details.mistakeId}, date: ${details.date}`);
    }

    Object.assign(mistakeDetails, {
      date: details.date,
      desc: details.desc,
      mistakeId: details.mistakeId,
      totalShots: details.totalShots,
      totalMistakes: details.totalMistakes,
      results: details.results,
    });
  },
  [REMOVE_MISTAKE](state: MistakeDefsState, id: number) {
    const index = state.mistakeDefs.findIndex((item) => item.id === id);

    if (index < 0) {
      throw Error(`REMOVE_MISTAKE: Unable to find mistake with ID: ${id}`);
    }

    const mistake = state.mistakeDefs[index];

    mistake.archived = true;

    Vue.set(state.mistakeDefs, index, mistake);
  },
  [REMOVE_CATEGORY](state: MistakeDefsState, id: number) {
    // Don't delete Putt category, since we require it to track putts
    if (id === PUTT_CATEGORY_ID) {
      return;
    }

    const mistakeToDelete = [] as Array<number>;

    state.mistakeDefs.forEach((item, index) => {
      if (item.categoryId === id) {
        mistakeToDelete.push(index);
      }
    });

    /* eslint-disable no-param-reassign */
    mistakeToDelete.forEach((itemIndex) => {
      const mistake = state.mistakeDefs[itemIndex];
      mistake.archived = true;
      Vue.set(state.mistakeDefs, itemIndex, mistake);
    });
    /* eslint-enable no-param-reassign */

    const index = state.shotCategories.findIndex((item) => item.id === id);

    if (index < 0) {
      throw Error(`REMOVE_CATEGORY: Unable to find category with ID: ${id}`);
    }

    const category = state.shotCategories[index];

    category.archived = true;

    Vue.set(state.shotCategories, index, category);
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

    const shotDetails = getDetailsForShot(shot.id, state.mistakeDetails);

    /*
     * Guard against old versions not having totalMistakes initalized to zero
     */
    if (Number.isNaN(shotDetails.totalMistakes)) {
      shotDetails.totalMistakes = 0;
    }

    shotDetails.totalMistakes += 1;

    const detailsIndex = getIndexForShotDetails(shotDetails, state.mistakeDetails);

    Vue.set(state.mistakeDetails, detailsIndex, shotDetails);
  },
  [UPDATE_SHOTS_FOR_SHOTTYPE](state: MistakeDefsState, shotId: number) {
    const index = state.mistakeDefs.findIndex((item) => item.id === shotId);

    if (index < 0) {
      throw Error(`UPDATE_SHOTS_FOR_SHOTTYPE: shot type doesn't exist for id: ${shotId}`);
    }

    const shot = state.mistakeDefs[index];

    const shotDetails = getDetailsForShot(shot.id, state.mistakeDetails);

    /*
     * Guard against old versions not having totalShots initalized to zero
     */
    if (Number.isNaN(shotDetails.totalShots)) {
      shotDetails.totalShots = 0;
    }

    shotDetails.totalShots += 1;

    const detailsIndex = getIndexForShotDetails(shotDetails, state.mistakeDetails);

    Vue.set(state.mistakeDetails, detailsIndex, shotDetails);
  },
  [REMOVE_MISTAKE_FOR_SHOTTYPE](state: MistakeDefsState, shotId: number) {
    const index = state.mistakeDefs.findIndex((item) => item.id === shotId);

    if (index < 0) {
      throw Error(`REMOVE_MISTAKE_FOR_SHOTTYPE: shot type doesn't exist for id: ${shotId}`);
    }

    const shot = state.mistakeDefs[index];

    // TODO: If removing due to a deleted round, check round date to ensure
    // removal of mistake from correct shot details version
    const shotDetails = getDetailsForShot(shot.id, state.mistakeDetails);

    if (shotDetails.totalMistakes > 0) {
      shotDetails.totalMistakes -= 1;
    }

    const detailsIndex = getIndexForShotDetails(shotDetails, state.mistakeDetails);

    Vue.set(state.mistakeDetails, detailsIndex, shotDetails);
  },
  [REMOVE_SHOT_FOR_SHOTTYPE](state: MistakeDefsState, shotId: number) {
    const index = state.mistakeDefs.findIndex((item) => item.id === shotId);

    if (index < 0) {
      throw Error(`REMOVE_SHOT_FOR_SHOTTYPE: shot type doesn't exist for id: ${shotId}`);
    }

    const shot = state.mistakeDefs[index];

    // TODO: If removing due to a deleted round, check round date to ensure
    // removal of mistake from correct shot details version
    const shotDetails = getDetailsForShot(shot.id, state.mistakeDetails);

    if (shotDetails.totalShots > 0) {
      shotDetails.totalShots -= 1;
    }
  },
  [UPDATE_RESULTS_FOR_SHOTTYPE](state: MistakeDefsState, shotResult: ShotResult) {
    const index = state.mistakeDefs.findIndex((item) => item.id === shotResult.shotId);

    if (index < 0) {
      throw Error('UPDATE_RESULTS_FOR_SHOTTYPE: shot type doesn\'t'
                  + ` exist for id: ${shotResult.shotId}`);
    }

    const shot = state.mistakeDefs[index];

    const shotDetails = getDetailsForShot(shot.id, state.mistakeDetails);

    if (!shotDetails.results) {
      shotDetails.results = {};
      RESULTS_MAP.forEach((value, key) => {
        (shotDetails.results as IndexableResults)[key] = 0;
      });
    }

    const resultKeys = getKeysForResult(shotResult.result);

    resultKeys.forEach((key) => {
      (shotDetails.results as IndexableResults)[key] += 1;
    });

    const detailsIndex = getIndexForShotDetails(shotDetails, state.mistakeDetails);

    Vue.set(state.mistakeDetails, detailsIndex, shotDetails);
  },
  [REMOVE_RESULT_FOR_SHOTTYPE](state: MistakeDefsState, shotResult: ShotResult) {
    const index = state.mistakeDefs.findIndex((item) => item.id === shotResult.shotId);

    if (index < 0) {
      throw Error('REMOVE_RESULT_FOR_SHOTTYPE: shot type doesn\'t'
                  + ` exist for id: ${shotResult.shotId}`);
    }

    const shot = state.mistakeDefs[index];

    // TODO: If removing due to a deleted round, check round date to ensure
    // removal of mistake from correct shot details version
    const shotDetails = getDetailsForShot(shot.id, state.mistakeDetails);

    const resultKeys = getKeysForResult(shotResult.result);

    resultKeys.forEach((key) => {
      if ((shotDetails.results as IndexableResults)[key] > 0) {
        (shotDetails.results as IndexableResults)[key] -= 1;
      }
    });

    const detailsIndex = getIndexForShotDetails(shotDetails, state.mistakeDetails);

    Vue.set(state.mistakeDetails, detailsIndex, shotDetails);
  },
  [UPDATE_EDITING_TAB](state: MistakeDefsState, newTab: string) {
    state.currentEditingTab = newTab;
  },
};

export default mutations;
