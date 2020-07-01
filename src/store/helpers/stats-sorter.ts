import { ShotCategoryWithSummary } from '@/store/mistake-defs/types.d';

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

function sort(shotCategories: Array<ShotCategoryWithSummary>, sortCriteria: Array<number>) {
  if (!sortCriteria.length) {
    return shotCategories;
  }

  let sortedCategories = shotCategories;
  const primarySortField = sortFields[sortCriteria[0]];
  let secondarySortField!: string;
  if (sortCriteria.length === 2) {
    secondarySortField = sortFields[sortCriteria[1]];
  }

  sortedCategories = sortedCategories.sort((a, b) => {
    if ((b as IndexableCategory)[primarySortField] > (a as IndexableCategory)[primarySortField]) {
      return 1;
    }

    if ((b as IndexableCategory)[primarySortField] < (a as IndexableCategory)[primarySortField]) {
      return -1;
    }

    if (secondarySortField) {
      if ((b as IndexableCategory)[secondarySortField] >
        (a as IndexableCategory)[secondarySortField]) {
        return 1;
      }

      if ((b as IndexableCategory)[secondarySortField] <
        (a as IndexableCategory)[secondarySortField]) {
        return -1;
      }
    }

    return 0;
  });

  return sortedCategories;
}

export default sort;
