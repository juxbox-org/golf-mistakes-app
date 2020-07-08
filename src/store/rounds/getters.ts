import { getKeysForResult } from '@/store/helpers/results';
import {
  GET_ALL_ROUNDS,
  GET_OVERVIEW_TAB,
  HAS_UPDATED, GET_ID, GET_CATEGORY_STATS_FOR_ROUND,
} from './getter-types';
import { RoundState, CategoryStat } from './types.d';

const getters = {
  [GET_ALL_ROUNDS](state: RoundState) {
    return state.rounds;
  },
  [GET_OVERVIEW_TAB](state: RoundState) {
    return state.currentOverviewTab;
  },
  [HAS_UPDATED](state: RoundState) {
    return state.hasUpdated;
  },
  [GET_ID](state: RoundState) {
    return state.id;
  },
  [GET_CATEGORY_STATS_FOR_ROUND]: (state: RoundState) => (id: number) => {
    const round = state.rounds.find((item) => item.id === id);

    if (!round) {
      throw Error(`GET_CATEGORY_STATS_FOR_ROUND: Unable to find round for ID: ${id}`);
    }

    const data = {
      course: round.course,
      date: round.date,
      stats: [] as Array<CategoryStat>,
    };

    const categoryMap = new Map<number, CategoryStat>();

    round.holes.forEach((hole) => {
      hole.shots.forEach((shot) => {
        if (!categoryMap.has(shot.categoryId)) {
          categoryMap.set(shot.categoryId, {
            categoryName: shot.category,
            totalShots: 0,
            totalMistakes: 0,
            results: new Map<string, number>(),
          });
        }

        const item = categoryMap.get(shot.categoryId);

        if (shot.mistake) {
          item.totalMistakes += 1;
        }

        item.totalShots += 1;

        const resultKeys = getKeysForResult(shot.result);

        resultKeys.forEach((result) => {
          if (!item.results.has(result)) {
            item.results.set(result, 1);
          } else {
            const numResults = item.results.get(result);
            item.results.set(result, numResults + 1);
          }
        });
      });
    });

    categoryMap.forEach((category) => {
      // Do an in-place replacement of total shots for each result with the results average
      category.results.forEach((value, key) => {
        category.results.set(key, Math.round((value / category.totalMistakes) * 100));
      });

      data.stats.push({
        ...category,
        averageMistakes: Math.round((category.totalMistakes / category.totalShots) * 100),
      });
    });

    data.stats = data.stats.sort((a, b) => {
      if (a.categoryName < b.categoryName) {
        return -1;
      }

      if (b.categoryName < a.categoryName) {
        return 1;
      }

      return 0;
    });

    return data;
  },
};

export default getters;
