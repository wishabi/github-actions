const core = require('@actions/core');
const { slack } = require('./src/slack');
const { tmate } = require('./src/tmate');

async function run() {
  try {
    const status = core.getInput("job_status")
    await slack();
    if (status === "failure") {
      await tmate();
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
