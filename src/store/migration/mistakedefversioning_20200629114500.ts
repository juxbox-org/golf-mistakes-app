import store from '@/store/index';
import { RootState } from '@/store/rootTypes.d';
import { INSERT_MISTAKE_DETAILS } from '@/store/mistake-defs/mutation-types';
import mutations from '@/store/mistake-defs/mutations';

async function up() {
  console.log('Running mistake def versioning migration script...');

  let numUpdates = 0;

  const mistakeDefState = (store.state as RootState).mistakeDefs;

  const mistakes = mistakeDefState.mistakeDefs;

  mistakes.forEach((mistake) => {
    const mistakeDetail = {
      mistakeId: mistake.id,
      date: new Date().toISOString(),
      totalShots: mistake.totalShots,
      totalMistakes: mistake.totalMistakes,
      results: mistake.results,
      desc: mistake.desc,
    };

    mutations[INSERT_MISTAKE_DETAILS](mistakeDefState, mistakeDetail);

    numUpdates += 1;
  });

  console.log(`  updated ${numUpdates} records`);
  console.log('...done running script');
}

async function down() {
  // nothing to do
}

export {
  up,
  down,
};
