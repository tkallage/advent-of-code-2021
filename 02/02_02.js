const fs = require("fs");

const instructions = fs
  .readFileSync(process.argv[2], "utf8")
  .toString()
  .split("\n")
  .filter((x) => !!x);

let depth = 0;
let position = 0;
let aim = 0;

for (const instruction of instructions) {
  const [command, unitsStr] = instruction.split(" ");
  const units = parseInt(unitsStr, 10);

  switch (command) {
    case "forward":
      position += units;
      depth += aim * units;
      break;
    case "down":
      aim += units;
      break;
    case "up":
      aim -= units;
      break;
    default:
      throw new Error("Unknown command " + command);
  }
}

console.log({ position, depth, result: position * depth });
