const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    core.info(`GitHub Context: ${JSON.stringify(github)}`)
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
