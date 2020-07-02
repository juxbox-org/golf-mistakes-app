import _ from 'lodash';
import store from '@/store/index';
import { RootState } from '@/store/rootTypes.d';
import { Results, MistakeDef } from '@/store/mistake-defs/types.d';

interface OldMistakeFields extends MistakeDef {
  desc: string;
  totalShots?: number;
  totalMistakes?: number;
  results?: Results;
}

async function up() {
  console.log('Running remove old mistake def fields migration script...');

  const mistakeDefState = (store.state as RootState).mistakeDefs;

  const mistakes = mistakeDefState.mistakeDefs;

  /* eslint-disable no-param-reassign */
  mistakes.forEach((mistake) => {
    if (!_.isNil((mistake as OldMistakeFields).desc)) {
      delete (mistake as OldMistakeFields).desc;
    }

    if (!_.isNil((mistake as OldMistakeFields).totalShots)) {
      delete (mistake as OldMistakeFields).totalShots;
    }

    if (!_.isNil((mistake as OldMistakeFields).totalMistakes)) {
      delete (mistake as OldMistakeFields).totalMistakes;
    }

    if (!_.isNil((mistake as OldMistakeFields).results)) {
      delete (mistake as OldMistakeFields).results;
    }
  });
  /* eslint-enable no-param-reassign */

  console.log('...done running script');
}

async function down() {
  // do nothing
}

export {
  up,
  down,
};
