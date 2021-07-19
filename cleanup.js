const core = require('@actions/core');
const { slack } = require('./src/slack');
const { tmate } = require('./src/tmate');
const { context } = require('@actions/github');

async function run() {
  try {
    const status = core.getInput("job_status")
    const disableTmate = core.getInput("disable_tmate")
    await slack();
    if (status === "failure" && !disableTmate && context.eventName === "workflow_dispatch") {
      await tmate();
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
