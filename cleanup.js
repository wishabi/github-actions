const core = require('@actions/core');
const { slack } = require('./src/slack');
const { ssh } = require('./src/ssh');

async function run() {
  try {
    const status = core.getInput("job_status")
    const enableSSH = core.getInput("enable_ssh")
    await slack();
    if (enableSSH && (status === "failure" || core.getInput("ssh_always"))) {
      await ssh();
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
