import { MISTAKES, CATEGORIES, SHOTS_CATEGORIES_WITH_SUMMARY } from './getter-types';
import { MistakeDefsState } from './types.d';

const getters = {
  [MISTAKES](state: MistakeDefsState) {
    return state.mistakeDefs;
  },
  [CATEGORIES](state: MistakeDefsState) {
    return state.shotCategories;
  },
  [SHOTS_CATEGORIES_WITH_SUMMARY](state: MistakeDefsState) {
    /* eslint-disable operator-linebreak */
    return state.shotCategories.map((category) => {
      let totalShots = 0;
      let totalMistakes = 0;
      const groupedShots =
        state.mistakeDefs.filter((mistake) => mistake.categoryId === category.id);
      groupedShots.forEach((shot) => {
        totalShots += shot.totalShots || 0;
        totalMistakes += shot.totalMistakes || 0;
      });

      const average = totalShots ? Math.round((totalMistakes / totalShots) * 100) : 0;

      return {
        ...category,
        shots: groupedShots,
        totalShots,
        totalMistakes,
        average,
        active: false,
      };
    });
    /* eslint-enable operator-linebreak */
  },
};

export default getters;
