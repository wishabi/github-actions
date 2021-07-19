const core = require('@actions/core');
const github = require('@actions/github');
const { WebClient } = require('@slack/web-api');
const { buildSlackAttachments, formatChannelName } = require('./slackUtils');

const slack = (async () => {
  const channel = core.getInput("slack_channel")
  const status = core.getInput("job_status")
  const always = core.getInput("slack_always")

  if (!channel) {
    core.info("No Slack channel provided - skipping Slack notification");
    return;
  }
  if (status === "cancelled") {
    core.info("Job cancelled, skipping notification")
    return;
  }
  try {
    if (!status) {
      core.setFailed("Slack channel provided but no job status passed in!")
      return;
    }
    if (!always && status !== "failure") {
      core.info("Slack only sending on failure and job succeeded - skipping notification")
      return;
    }
    core.info("Sending Slack message...");
    const color = status === "failure" ? "danger" : "good"
    const text = status === "failure" ? "GitHub Action build failed!" : "GitHub Action build succeeded!"
    const token = process.env.SLACK_BOT_TOKEN;
    const slack = new WebClient(token);

    const attachments = buildSlackAttachments({ color, github });
    const channelId = await lookUpChannelId({ slack, channel });

    if (!channelId) {
      core.setFailed(`Slack channel #${channel} could not be found.`);
      return;
    }

    const args = {
      channel: channelId,
      text,
      attachments,
    };

    await slack.chat.postMessage(args);
    core.info(`Sent message to channel ${channel} (${channelId})`)
  } catch (error) {
    core.setFailed(error);
  }
});

async function lookUpChannelId({ slack, channel }) {
  let result;
  const formattedChannel = formatChannelName(channel);

  // Async iteration is similar to a simple for loop.
  // Use only the first two parameters to get an async iterator.
  for await (const page of slack.paginate('conversations.list', { types: 'public_channel, private_channel' })) {
    // You can inspect each page, find your result, and stop the loop with a `break` statement
    const match = page.channels.find(c => c.name === formattedChannel);
    if (match) {
      result = match.id;
      break;
    }
  }

  return result;
}

module.exports.slack = slack;
