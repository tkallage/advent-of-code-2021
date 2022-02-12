const fs = require("fs");
const { sortBy } = require("lodash");
const path = require("path");

module.exports = {
  getInputLines() {
    const filepath = path.join(path.parse(process.argv[1]).dir, "input.txt");

    return fs
      .readFileSync(filepath)
      .toString()
      .split(/\r?\n/)
      .filter((x) => !!x);
  },

  median(numbers) {
    const sortedNumbers = sortBy(numbers);
    if (numbers.length % 2 === 0) {
      return (
        0.5 *
        (sortedNumbers[numbers.length / 2 - 1] +
          sortedNumbers[numbers.length / 2])
      );
    } else {
      return sortedNumbers[(numbers.length - 1) / 2];
    }
  },
};
