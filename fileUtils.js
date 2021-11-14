const fs = require("fs");

function getFileContentsAsString(fileName) {
  return fs.readFileSync(fileName, { encoding: "utf-8" });
}

function fileContentsToBase64(contents) {
  return Buffer.from(contents).toString("base64");
}

module.exports = {
  getFileContentsAsString,
  fileContentsToBase64,
};
