const fs = require("fs");
const { compact, sum, sortBy } = require("lodash");
const path = require("path");

const inputLines = fs
  .readFileSync(path.join(path.parse(process.argv[1]).dir, "input.txt"))
  .toString()
  .split(/\r?\n/)
  .filter((x) => !!x);

const heightMatrix = inputLines.map((line) =>
  line.split("").map((char) => parseInt(char, 10))
);

let basinMatrix = heightMatrix.map((row) => row.map(() => undefined));
let nextBasinIndex = 0;

function replaceInMatrix(matrix, valueToReplace, replacer) {
  return matrix.map((row) =>
    row.map((value) => (value === valueToReplace ? replacer : value))
  );
}

for (let iRow = 0; iRow < heightMatrix.length; iRow++) {
  for (let iCol = 0; iCol < heightMatrix[iRow].length; iCol++) {
    const value = heightMatrix[iRow][iCol];
    if (value === 9) {
      continue;
    }
    const adjacentBasins = [
      basinMatrix[iRow][iCol - 1],
      basinMatrix[iRow - 1]?.[iCol],
    ].filter((adjacentValue) => adjacentValue !== undefined);
    if (adjacentBasins.length === 0) {
      basinMatrix[iRow][iCol] = nextBasinIndex;
      nextBasinIndex++;
    } else if (adjacentBasins.length === 1) {
      basinMatrix[iRow][iCol] = adjacentBasins[0];
    } else {
      basinMatrix[iRow][iCol] = adjacentBasins[0];
      basinMatrix = replaceInMatrix(
        basinMatrix,
        adjacentBasins[1],
        adjacentBasins[0]
      );
    }
  }
}

const basinSizes = basinMatrix.flat().reduce((agg, basinIndex) => {
  if (basinIndex !== undefined) {
    agg[basinIndex] = (agg[basinIndex] ?? 0) + 1;
  }
  return agg;
}, {});

const largestThreeBasins = sortBy(Object.values(basinSizes)).slice(-3);

console.log(
  largestThreeBasins[0] * largestThreeBasins[1] * largestThreeBasins[2]
);
