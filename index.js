const core = require("@actions/core");
const github = require("@actions/github");
const {getFileContentsAsString, fileContentsToBase64, getExitNodes} = require("./utils.js");

async function executeAction() {
  try {
    const file = core.getInput("file");
    const branch = core.getInput("branch");
    const message = "Updated Tor Exit nodes";
    const committerName = core.getInput("commiter_name");
    const committerEmail = core.getInput("commiter_email");

    // Prepare file
    const fileContents = getFileContentsAsString(file);
    const encodedContents = fileContentsToBase64(JSON.stringify(await getExitNodes()));

    // Prepare API
    const octokit = github.getOctokit(core.getInput("token"));
    const owner = github.context.repo.owner;
    const repo = github.context.repo.repo;

    // Update file

    const contents = await octokit.rest.repos.getContent({
      owner,
      path: file,
      repo,
      branch,
    });

    const commitObj = {
      message: message,
      content: encodedContents,
      owner: owner,
      repo: repo,
      path: file,
      sha: contents.data.sha,
    };

    core.debug(JSON.stringify(commitObj));

    const updateResult = await octokit.rest.repos.createOrUpdateFileContents(commitObj);
    core.setOutput("sha", updateResult.data.commit.sha);
  } catch (error) {
    core.setFailed(error.message);
  }
}

executeAction();
