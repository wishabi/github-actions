const core = require('@actions/core');
const { slack } = require('./src/slack');
const { tmate } = require('./src/tmate');

async function run() {
  try {
    const status = core.getInput("job_status")
    const enableTmate = core.getInput("enable_tmate")
    await slack();
    if (status === "failure" && enableTmate) {
      await tmate();
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
