const fs = require("fs");
const { compact, sum } = require("lodash");
const path = require("path");

const inputLines = fs
  .readFileSync(path.join(path.parse(process.argv[1]).dir, "input.txt"))
  .toString()
  .split(/\r?\n/)
  .filter((x) => !!x);

const heightMatrix = inputLines.map((line) =>
  line.split("").map((char) => parseInt(char, 10))
);

const lowPoints = [];

for (let iRow = 0; iRow < heightMatrix.length; iRow++) {
  for (let iCol = 0; iCol < heightMatrix[iRow].length; iCol++) {
    const value = heightMatrix[iRow][iCol];
    const adjacentValues = [
      heightMatrix[iRow][iCol - 1],
      heightMatrix[iRow][iCol + 1],
      heightMatrix[iRow - 1]?.[iCol],
      heightMatrix[iRow + 1]?.[iCol],
    ].filter((adjacentValue) => adjacentValue !== undefined);
    if (adjacentValues.every((adjacentValue) => adjacentValue > value)) {
      lowPoints.push(value);
    }
  }
}

const riskLevels = lowPoints.map((lowPointValue) => lowPointValue + 1);

const totalRiskLevel = sum(riskLevels);

console.log({ totalRiskLevel });
