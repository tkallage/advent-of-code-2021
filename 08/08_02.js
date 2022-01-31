const fs = require("fs");
const { sortBy, difference } = require("lodash");

const inputLines = fs
  .readFileSync(process.argv[2])
  .toString()
  .split(/\r?\n/)
  .filter((x) => !!x);

const patterns = inputLines.map((line) =>
  line.split(" | ").map((x) => x.split(" ").map((seq) => sortBy(seq)))
);

function getPatternMapping(inputSequences) {
  const num1 = inputSequences.find((x) => x.length === 2);
  const num4 = inputSequences.find((x) => x.length === 4);
  const num7 = inputSequences.find((x) => x.length === 3);
  const num8 = inputSequences.find((x) => x.length === 7);

  const num6 = inputSequences
    .filter((x) => x.length === 6)
    .find((x) => difference(x, num1).length === 5);

  const num5 = inputSequences
    .filter((x) => x.length === 5)
    .find((x) => difference(x, num6).length === 0);

  const num3 = inputSequences
    .filter((x) => x.length === 5)
    .filter((x) => x !== num5)
    .find((x) => difference(x, num1).length === 3);
  const num2 = inputSequences
    .filter((x) => x.length === 5)
    .filter((x) => x !== num5)
    .find((x) => difference(x, num1).length === 4);

  const num9 = inputSequences
    .filter((x) => x.length === 6)
    .filter((x) => x !== num6)
    .find((x) => difference(x, num3).length === 1);
  const num0 = inputSequences
    .filter((x) => x.length === 6)
    .filter((x) => x !== num6)
    .find((x) => difference(x, num3).length === 2);

  return {
    [num0]: 0,
    [num1]: 1,
    [num2]: 2,
    [num3]: 3,
    [num4]: 4,
    [num5]: 5,
    [num6]: 6,
    [num7]: 7,
    [num8]: 8,
    [num9]: 9,
  };
}

let outputValueSum = 0;

for (const [input, output] of patterns) {
  const patternMapping = getPatternMapping(input);
  const outputStr = output
    .map((digitPattern) => patternMapping[digitPattern.join()])
    .join("");
  const outputValue = parseInt(outputStr, 10);

  outputValueSum += outputValue;
}

console.log(outputValueSum);
