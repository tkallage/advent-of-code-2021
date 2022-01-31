const fs = require("fs");
const { sumBy } = require("lodash");

const inputLines = fs
  .readFileSync(process.argv[2])
  .toString()
  .split(/\r?\n/)
  .filter((x) => !!x);

const positions = inputLines[0].split(",").map((x) => parseInt(x, 10));

const maxPos = Math.max(...positions);
const minPos = Math.min(...positions);

let minFuelA = 999999999999;
let minFuelPosA = minPos - 1;
let minFuelB = 999999999999;
let minFuelPosB = minPos - 1;

for (let pos = minPos; pos <= maxPos; pos++) {
  const totalFuelA = sumBy(positions, (x) => Math.abs(x - pos));
  const totalFuelB = sumBy(
    positions,
    (x) => (Math.abs(x - pos) * (Math.abs(x - pos) + 1)) / 2
  );
  if (totalFuelA < minFuelA) {
    minFuelA = totalFuelA;
    minFuelPosA = pos;
  }
  if (totalFuelB < minFuelB) {
    minFuelB = totalFuelB;
    minFuelPosB = pos;
  }
}

console.log({ minFuelA, minFuelPosA, minFuelB, minFuelPosB });
