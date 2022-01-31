const fs = require("fs");

const inputLines = fs
  .readFileSync(process.argv[2])
  .toString()
  .split(/\r?\n/)
  .filter((x) => !!x);

const ages = inputLines[0].split(",").map((x) => parseInt(x, 10));
const totalDays = 80;

for (let i = 0; i < totalDays; i++) {
  [...ages].forEach((age, i) => {
    ages[i]--;
    if (ages[i] < 0) {
      ages[i] = 6;
      ages.push(8);
    }
  });
}
console.log(ages.length);
