const core = require('@actions/core');

async function run() {
  try {
    core.info(`In post function`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
