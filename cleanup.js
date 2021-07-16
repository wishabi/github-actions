const core = require('@actions/core');
const { slack } = require('./src/slack');

async function run() {
  try {
    await slack();
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
