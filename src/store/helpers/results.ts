/* eslint-disable no-bitwise */
import { RESULTS_MAP } from '@/store/consts';
import { MistakeRecord } from '@/store/mistake-defs/types.d';

function getKeysForResult(result: number) {
  const keys: Array<string> = [];

  if (!result) {
    return keys;
  }

  RESULTS_MAP.forEach((value, key) => {
    if ((value & result) !== 0) {
      keys.push(key);
    }
  });

  return keys;
}

function resultsSummaryForShot(shotType: MistakeRecord): Map<string, number> {
  if (!shotType.mistakeDetails.results) {
    return new Map<string, number>();
  }

  const results = Object.entries(shotType.mistakeDetails.results);

  const summary = new Map<string, number>();

  results.forEach((result) => {
    if (!shotType.mistakeDetails.totalShots) {
      return;
    }

    const resultAvg = Math.round((result[1] / shotType.mistakeDetails.totalShots) * 100);

    if (resultAvg) {
      summary.set(result[0], resultAvg);
    }
  });

  return new Map([...summary.entries()].sort((a, b) => b[1] - a[1]));
}

export {
  getKeysForResult,
  resultsSummaryForShot,
};
