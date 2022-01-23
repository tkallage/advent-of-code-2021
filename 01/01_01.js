const fs = require("fs");

const result = fs
  .readFileSync("01_input.txt")
  .toString()
  .split("\n")
  .map((x) => parseInt(x))
  .filter((x) => isFinite(x))
  .reduce(
    (agg, num) => {
      if (agg.lastMeasurement < num) {
        agg.increments++;
      }
      agg.lastMeasurement = num;

      return agg;
    },
    {
      lastMeasurement: NaN,
      increments: 0,
    }
  );

console.log(result.increments);
