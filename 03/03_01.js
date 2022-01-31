const fs = require("fs");
const lodash = require("lodash");

const reportLines = fs
  .readFileSync(process.argv[2], "utf8")
  .toString()
  .split("\n")
  .filter((x) => !!x);

let gammaStr = "";
let epsilonStr = "";

for (let bit = 0; ["0", "1"].includes(reportLines[0][bit]); bit++) {
  const bits = reportLines.map((line) => parseInt(line[bit]));
  if (lodash.mean(bits) > 0.5) {
    gammaStr += "1";
    epsilonStr += "0";
  } else {
    gammaStr += "0";
    epsilonStr += "1";
  }
}

const gamma = parseInt(gammaStr, 2);
const epsilon = parseInt(epsilonStr, 2);

console.log({ gammaStr, epsilonStr, gamma, epsilon, result: gamma * epsilon });
