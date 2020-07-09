import _ from 'lodash';
import { ShotCategoryWithSummary, MistakeRecord } from '@/store/mistake-defs/types.d';

const sortFields = [
  'totalShots',
  'totalMistakes',
  'average',
];

/* eslint-disable @typescript-eslint/no-explicit-any */
interface IndexableCategory {
  [key: string]: any;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/* eslint-disable no-extend-native */

declare global {
  interface Array<T> {
    sortByCriteria(sortCriteria: Array<number>, sortField?: string): Array<T>;
  }
}

/* eslint-disable func-names */
Array.prototype.sortByCriteria = function (sortCriteria: Array<number>, sortField?: string) {
  const primarySortField = sortFields[sortCriteria[0]];
  let secondarySortField!: string;
  if (sortCriteria.length === 2) {
    secondarySortField = sortFields[sortCriteria[1]];
  }

  return this.sort((a, b) => {
    const first = sortField ? a[sortField] : a;
    const second = sortField ? b[sortField] : b;

    if (_.isNil((first as IndexableCategory)[primarySortField])) {
      return 1;
    }

    if (_.isNil((second as IndexableCategory)[primarySortField])) {
      return -1;
    }

    if ((first as IndexableCategory)[primarySortField] >
      (second as IndexableCategory)[primarySortField]) {
      return -1;
    }

    if ((first as IndexableCategory)[primarySortField] <
      (second as IndexableCategory)[primarySortField]) {
      return 1;
    }

    if (secondarySortField) {
      if ((first as IndexableCategory)[secondarySortField] >
        (second as IndexableCategory)[secondarySortField]) {
        return -1;
      }

      if ((first as IndexableCategory)[secondarySortField] <
        (second as IndexableCategory)[secondarySortField]) {
        return 1;
      }
    }

    return 0;
  });
};
/* eslint-enable func-names */
/* eslint-enable no-extend-native */

function getShotAverage(shot: MistakeRecord) {
  if (_.isNil(shot.mistakeDetails.totalShots) || _.isNil(shot.mistakeDetails.totalMistakes)) {
    return 0;
  }

  if (!shot.mistakeDetails.totalShots || !shot.mistakeDetails.totalMistakes) {
    return 0;
  }

  return Math.round((shot.mistakeDetails.totalMistakes / shot.mistakeDetails.totalShots) * 100);
}

function sortByCategory(shotCategories: Array<ShotCategoryWithSummary>,
  sortCriteria: Array<number>) {
  if (!sortCriteria.length) {
    return shotCategories;
  }

  const sortedCategories = shotCategories.sortByCriteria(sortCriteria);

  /* eslint-disable no-param-reassign */
  sortedCategories.forEach((category) => {
    const shots = [] as Array<MistakeRecord>;
    category.shots.forEach((shot) => {
      shots.push({
        ...shot,
        mistakeDetails: {
          ...shot.mistakeDetails,
          average: getShotAverage(shot),
        },
      });
    });

    category.shots = shots.sortByCriteria(sortCriteria, 'mistakeDetails');
  });
  /* eslint-enable no-param-reassign */

  return sortedCategories;
}

function sortByShot(shots: Array<MistakeRecord>, sortCriteria: Array<number>) {
  if (!sortCriteria.length) {
    return shots;
  }

  const shotsWithAvg = shots.map((shot) => ({
    ...shot,
    mistakeDetails: {
      ...shot.mistakeDetails,
      average: getShotAverage(shot),
    },
  }));

  return shotsWithAvg.sortByCriteria(sortCriteria, 'mistakeDetails');
}

export {
  sortByCategory,
  sortByShot,
};
