jest.mock('@actions/core');
jest.mock('@slack/web-api')
jest.mock('@actions/github')
const core = require('@actions/core');
const { WebClient, postMessage } = require('@slack/web-api');
const { slack } = require('./src/slack');
const github = require('@actions/github')

describe('slack', () => {
  let client;
  beforeAll(() => {
    client = new WebClient();
    process.env.SLACK_BOT_TOKEN = "my-token"
    process.env.GITHUB_REF = "abcdef"
    process.env.GITHUB_RUN_ID = "535677"
  });
  beforeEach(() => {
    core.clearInputs()
    core.setFailed.mockClear()
    core.info.mockClear()
    postMessage.mockClear()
  })

  test('does not send a message if cancelled', async () => {
    core.setInputs({
      slack_channel: 'my-channel',
      job_status: 'cancelled',
      slack_always: false
    })
    await slack();
    expect(postMessage).not.toHaveBeenCalled();
    expect(core.info).toHaveBeenCalledWith("Job cancelled, skipping notification")
  })

  test('does not send a message with no Slack channel', async() => {
    core.setInputs({
      job_status: 'failure',
      slack_always: false
    })
    await slack();
    expect(postMessage).not.toHaveBeenCalled();
    expect(core.info).toHaveBeenCalledWith("No Slack channel provided - skipping Slack notification")
  })

  test('does not send a message on success without slack_always', async() => {
    core.setInputs({
      slack_channel: 'my-channel',
      job_status: 'success',
      slack_always: false
    })
    await slack();
    expect(postMessage).not.toHaveBeenCalled();
    expect(core.info).toHaveBeenCalledWith("Slack only sending on failure and job succeeded - skipping notification")
  })

  test('does not send a message if channel cannot be found', async () => {
    core.setInputs({
      slack_channel: 'not-my-channel',
      job_status: 'failure',
      slack_always: false
    })
    await slack();
    expect(postMessage).not.toHaveBeenCalled();
    expect(core.setFailed).toHaveBeenCalledWith("Slack channel #not-my-channel could not be found.")
  })

  test('sends a message on failure', async () => {
    github.setPullRequest(false)
    core.setInputs({
      slack_channel: 'my-channel',
      job_status: 'failure',
      slack_always: false
    })
    await slack();
    expect(postMessage).toHaveBeenCalledWith(expect.objectContaining({
      attachments: [
            {
              color: "danger",
              fields: [
            {
              short: true,
              title: "Job",
              value: "<https://github.com/wishabi/my-repo/actions/runs/535677 | my-job>"
            },
            {
              short: true,
              title: "Repo",
              value: "<https://github.com/wishabi/my-repo | wishabi/my-repo>"
            },
            {
              short: true,
              title: "Branch",
              value: "<https://github.com/wishabi/my-repo/commit/abc123 | feature-branch>"
            },
            {
              short: true,
              title: "Event",
              value: "push"
            }
          ],
          footer: "<https://github.com/wishabi/my-repo | wishabi/my-repo>",
          footer_icon: "https://github.githubassets.com/favicon.ico",
              ts: expect.any(Number)
        }
      ],
      channel: 5,
      text: "GitHub Action build failed!"
    }));
    expect(core.info).toHaveBeenCalledWith("Sent message to channel my-channel (5)")
  })

  test('sends a message for pull requests', async () => {
    github.setPullRequest(true)
    core.setInputs({
      slack_channel: 'my-channel',
      job_status: 'failure',
      slack_always: false
    })
    await slack();
    expect(postMessage).toHaveBeenCalledWith(expect.objectContaining({
      attachments: [
            {
              color: "danger",
              fields: [
            {
              short: true,
              title: "Job",
              value: "<https://github.com/wishabi/my-repo/actions/runs/535677 | my-job>"
            },
            {
              short: true,
              title: "Repo",
              value: "<https://github.com/wishabi/my-repo | wishabi/my-repo>"
            },
            {
              short: true,
              title: "Pull Request",
              value: "<https://github.com/wishabi/my-repo/pull/1 | My Pull Request>"
            },
            {
              short: true,
              title: "Event",
              value: "pull_request"
            }
          ],
          footer: "<https://github.com/wishabi/my-repo | wishabi/my-repo>",
          footer_icon: "https://github.githubassets.com/favicon.ico",
              ts: expect.any(Number)
        }
      ],
      channel: 5,
      text: "GitHub Action build failed!"
    }));
    expect(core.info).toHaveBeenCalledWith("Sent message to channel my-channel (5)")
  })

  test('sends message for success', async () => {
    github.setPullRequest(false)
    core.setInputs({
      slack_channel: 'my-channel',
      job_status: 'success',
      slack_always: true
    })
    await slack();
    expect(postMessage).toHaveBeenCalledWith(expect.objectContaining({
      attachments: [
            {
              color: "good",
              fields: [
            {
              short: true,
              title: "Job",
              value: "<https://github.com/wishabi/my-repo/actions/runs/535677 | my-job>"
            },
            {
              short: true,
              title: "Repo",
              value: "<https://github.com/wishabi/my-repo | wishabi/my-repo>"
            },
            {
              short: true,
              title: "Branch",
              value: "<https://github.com/wishabi/my-repo/commit/abc123 | feature-branch>"
            },
            {
              short: true,
              title: "Event",
              value: "push"
            }
          ],
          footer: "<https://github.com/wishabi/my-repo | wishabi/my-repo>",
          footer_icon: "https://github.githubassets.com/favicon.ico",
              ts: expect.any(Number)
        }
      ],
      channel: 5,
      text: "GitHub Action build succeeded!"
    }));
    expect(core.info).toHaveBeenCalledWith("Sent message to channel my-channel (5)")
  })

})
