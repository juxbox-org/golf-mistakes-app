import store from '@/store/index';

const migrationScripts = [
  'mistakedefversioning_20200629114500',
  'removeoldmistakedeffields_20200701212000',
];

async function runMigration(scriptName: string) {
  const module = await import(`@/store/migration/${scriptName}`);
  return module.up().then(() => {
    store.state.migrations.push(scriptName);
  });
}

function runMigrationScripts() {
  return new Promise((resolve) => {
    const scriptsToRun = migrationScripts.filter((script) =>
      !store.getters.migrations.includes(script));

    // Execute promises in sequential order
    const result = scriptsToRun.sort().reduce(async (accumAsPromise, scriptName) => {
      await accumAsPromise;
      return runMigration(scriptName);
    }, Promise.resolve());

    result.then(() => {
      resolve();
    });
  });
}

export default runMigrationScripts;
