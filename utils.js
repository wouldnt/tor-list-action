import { readFileSync } from "fs";
import fetch from "node-fetch";

function getFileContentsAsString(fileName) {
  return readFileSync(fileName, { encoding: "utf-8" });
}

function fileContentsToBase64(contents) {
  return Buffer.from(contents).toString("base64");
}

async function getExitNodes() {
  return fetch("https://check.torproject.org/torbulkexitlist")
    .then((response) => response.text())
    .then((text) => text.split("\n").filter(Boolean))
    .then((lines) => lines.map((line) => line.split(" ")[0]))
    .catch((error) => {
      console.log(error);
      process.exit(1)
    });
}

export { getFileContentsAsString, fileContentsToBase64, getExitNodes };