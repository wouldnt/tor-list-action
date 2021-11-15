const core = require("@actions/core");
const github = require("@actions/github");
const fileHelpers = require("./fileUtils.js");

async function executeAction() {
  try {
    const file = core.getInput("file");
    const branch = core.getInput("branch");
    const message = "Updated Tor Exit nodes";
    const committerName = core.getInput("commiter_name");
    const committerEmail = core.getInput("commiter_email");

    // Prepare file
    const fileContents = fileHelpers.getFileContentsAsString(file);
    const encodedContents = fileHelpers.fileContentsToBase64("hello world");

    // Prepare API
    const octokit = github.getOctokit(core.getInput("token"));
    const owner = github.context.repo.owner;
    const repo = github.context.repo.repo;

    // Update file

    const contents = await octokit.rest.repos.getContent({
      owner,
      path,
      repo,
      branch,
    });

    const commitObj = {
      message: message,
      committer: {
        name: committerName,
        email: committerEmail,
      },
      content: encodedContents,
      owner: owner,
      repo: repo,
      path: file,
      sha: contents.data.sha,
    };

    core.debug(JSON.stringify(commitObj));

    const updateResult = await octokit.repos.createOrUpdateFile(commitObj);
    core.setOutput("sha", updateResult.data.commit.sha);
  } catch (error) {
    core.setFailed(error.message);
  }
}

executeAction();
