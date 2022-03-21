import { cloneDeep } from "lodash";
import { getInputLines } from "./lib";

function main(inputpath: string) {
  console.log("=====");
  console.log(inputpath);
  console.log("=====");

  const inputLines = getInputLines(inputpath);

  solve(inputLines);
}

function solve(inputLines: string[], v = true) {
  let s = [...inputLines.map((line) => [...line])];
  for (let steps = 0; steps < 10000; steps++) {
    let updates = 0;
    // move east
    let update: string[][] = cloneDeep(s);
    for (const [iLine, line] of s.entries()) {
      for (const [iChar, char] of [...line].entries()) {
        if (char !== ">") {
          continue;
        }
        const iCharNext = (iChar + 1) % line.length;
        if (line[iCharNext] === ".") {
          update[iLine][iChar] = ".";
          update[iLine][iCharNext] = char;
          updates++;
        }
      }
    }
    s = update;

    // move south
    update = cloneDeep(s);
    for (const [iLine, line] of s.entries()) {
      for (const [iChar, char] of [...line].entries()) {
        if (char !== "v") {
          continue;
        }
        const iLineNext = (iLine + 1) % inputLines.length;
        if (s[iLineNext][iChar] === ".") {
          update[iLine][iChar] = ".";
          update[iLineNext][iChar] = "v";
          updates++;
        }
      }
    }
    s = update;

    v &&
      console.log(`step ${steps.toString().padStart(3)}: ${updates} updates`);

    if (updates === 0) {
      console.log(`converged after ${steps + 1} steps`);

      break;
    }
  }
}

main("25_input_example.txt");
main("25_input.txt");
