/* eslint-disable no-bitwise */
import { RESULTS_MAP } from '@/store/consts';

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

export default getKeysForResult;
