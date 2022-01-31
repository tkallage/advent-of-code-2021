const fs = require("fs");

const inputLines = fs
  .readFileSync(process.argv[2])
  .toString()
  .split(/\r?\n/)
  .filter((x) => !!x);

const outputs = inputLines.map((line) => line.split(" | ")[1].split(" "));

console.log(
  outputs.flat().filter((x) => [2, 3, 4, 7].includes(x.length)).length
);
