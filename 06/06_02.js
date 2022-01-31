const fs = require("fs");

const inputLines = fs
  .readFileSync(process.argv[2])
  .toString()
  .split(/\r?\n/)
  .filter((x) => !!x);

const ages = inputLines[0]
  .split(",")
  .map((x) => parseInt(x, 10))
  .reduce((acc, x) => {
    acc[x] = (acc[x] ?? 0) + 1;
    return acc;
  }, {});
const totalDays = 256;

function countFish(ages) {
  return Object.values(ages).reduce((acc, num) => acc + num, 0);
}

console.log(ages, countFish(ages));
for (let i = 0; i < totalDays; i++) {
  for (let age = 0; age <= 8; age++) {
    ages[age - 1] = ages[age] ?? 0;
  }
  ages[8] = ages[-1];
  ages[6] = (ages[6] ?? 0) + ages[-1];
  delete ages[-1];
}
console.log(ages, countFish(ages));
