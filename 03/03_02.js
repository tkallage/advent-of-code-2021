const fs = require("fs");
const lodash = require("lodash");

const reportLines = fs
  .readFileSync(process.argv[2])
  .toString()
  .split(/\r?\n/)
  .filter((x) => !!x);

let gammaStr = "";
let epsilonStr = "";

let linesOxygen = [...reportLines];
let linesCo2 = [...reportLines];

function oxygenGeneratorCriterion(bits) {
  return lodash.mean(bits) >= 0.5 ? 1 : 0;
}

function co2scrubberCriterion(bits) {
  return lodash.mean(bits) < 0.5 ? 1 : 0;
}

for (let bit = 0; ["0", "1"].includes(reportLines[0][bit]); bit++) {
  if (linesOxygen.length > 1) {
    const bitToKeepOxygen = oxygenGeneratorCriterion(
      linesOxygen.map((line) => parseInt(line[bit]))
    );
    linesOxygen = linesOxygen.filter(
      (line) => line[bit] === bitToKeepOxygen.toString()
    );
  }
  if (linesCo2.length > 1) {
    const bitToKeepCo2 = co2scrubberCriterion(
      linesCo2.map((line) => parseInt(line[bit]))
    );
    linesCo2 = linesCo2.filter((line) => line[bit] === bitToKeepCo2.toString());
  }
}

const oxygenRating = parseInt(linesOxygen[0], 2);
const co2Rating = parseInt(linesCo2[0], 2);

console.log({
  linesOxygen,
  linesCo2,
  oxygenRating,
  co2Rating,
  result: oxygenRating * co2Rating,
});
