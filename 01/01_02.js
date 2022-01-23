const fs = require("fs");

const numbers = fs
  .readFileSync("01_input.txt")
  .toString()
  .split("\n")
  .map((x) => parseInt(x))
  .filter((x) => isFinite(x));

const result = numbers.reduce((agg, num, index, arr) => {
  if (index < 4) {
    return agg;
  }
  const A = arr[index - 1] + arr[index - 2] + arr[index - 3];
  const B = arr[index] + arr[index - 1] + arr[index - 2];

  if (B > A) {
    agg++;
  }
  return agg;
}, 0);

console.log(result);
