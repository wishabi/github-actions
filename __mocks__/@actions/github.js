const github = jest.createMockFromModule('@actions/github');

let pullRequest = false

github.setPullRequest = (bool) => {
  pullRequest = bool;
}

Object.defineProperty(github, 'context', {
  get: () => {
    if (pullRequest) {
      return {
        payload: {
          pull_request: {
            head: {
              ref: 'master',
              sha: '123abc'
            },
            html_url: "https://github.com/wishabi/my-repo/pull/1",
            title: 'My Pull Request'
          }
        },
        repo: {
          owner: 'wishabi',
          repo: 'my-repo'
        },
        ref: 'refs/heads/feature-branch',
        sha: 'abc123',
        job: 'my-job',
        eventName: 'pull_request'
      }
    }
    return {
      payload: {},
      owner: 'wishabi',
      repo: {
        owner: 'wishabi',
        repo: 'my-repo'
      },
      ref: 'refs/heads/feature-branch',
      sha: 'abc123',
      job: 'my-job',
      eventName: 'push'
    }
  }
});

module.exports = github;
