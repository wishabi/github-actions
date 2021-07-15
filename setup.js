const core = require('@actions/core');

async function run() {
  try {
    core.info(`In pre function`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
