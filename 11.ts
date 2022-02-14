import { getInputLines } from "./lib";

const inputLines = getInputLines("11_input.txt");

const initialEnergies = inputLines.flatMap((line) =>
  line.split("").map((char) => parseInt(char, 10))
);
const DIM_X = inputLines[0].length;
const DIM_Y = inputLines.length;

function adjacentIndices(index: number) {
  const indices: number[] = [];
  if (Math.floor((index - 1) / DIM_X) === Math.floor(index / DIM_X)) {
    indices.push(index - 1 - DIM_X, index - 1, index - 1 + DIM_X);
  }
  if (Math.floor((index + 1) / DIM_X) === Math.floor(index / DIM_X)) {
    indices.push(index + 1 - DIM_X, index + 1, index + 1 + DIM_X);
  }
  indices.push(index - DIM_X, index + DIM_X);

  return indices.filter((idx) => idx >= 0 && idx < DIM_X * DIM_Y);
}

function step(energies: number[]) {
  const newEnergies = energies.map((energy) => energy + 1);
  let index = 0;
  while (index < newEnergies.length) {
    if (newEnergies[index] > 9) {
      const otherIndices = adjacentIndices(index);
      for (const otherIndex of otherIndices) {
        if (newEnergies[otherIndex] !== 0) {
          newEnergies[otherIndex]++;
        }
      }
      newEnergies[index] = 0;
      index = Math.min(...otherIndices);
    } else {
      index++;
    }
  }

  const newFlashes = newEnergies.reduce(
    (acc, e) => (e === 0 ? acc + 1 : acc),
    0
  );

  return { newEnergies, newFlashes };
}

function prettyEnergies(energies: number[]) {
  let s = "";
  energies.forEach((value, index) => {
    const highlights: { [key: number]: string | undefined } & { "+": string } =
      {
        0: "\x1b[1m\x1b[31m",
        9: "\x1b[1m\x1b[32m",
        "+": "\x1b[1m\x1b[32m\x1b[7m",
      };
    const highlight = highlights[value > 9 ? "+" : value];
    if (highlight) {
      s += highlight;
    }
    s += value.toString().padStart(1, " ");

    if (highlight) {
      s += "\x1b[0m";
    }
    if ((index + 1) % DIM_X === 0 && index + 1 !== DIM_X * DIM_Y) {
      s += "\n";
    }
  });

  return s;
}

function flashesAfterNSteps(n: number) {
  let energies = [...initialEnergies];
  let totalFlashes = 0;

  console.log(prettyEnergies(energies));
  for (const i of Array.from({ length: n }).map((x, i) => i)) {
    const { newEnergies, newFlashes } = step(energies);
    energies = newEnergies;
    totalFlashes += newFlashes;
  }
  console.log("result after step", n);
  console.log(prettyEnergies(energies));
  console.log({ totalFlashes });
}

function firstSynchronizedFlash() {
  let energies = [...initialEnergies];

  console.log(prettyEnergies(energies));
  let lastStep = 0;
  let flashesInLastStep = 0;
  while (flashesInLastStep < DIM_X * DIM_Y && lastStep < 10000) {
    const { newEnergies, newFlashes } = step(energies);
    energies = newEnergies;
    flashesInLastStep = newFlashes;
    lastStep++;
  }

  console.log(`first sync flash after ${lastStep} steps`);
  console.log(prettyEnergies(energies));
}

console.log("PART 1");
flashesAfterNSteps(100);
console.log("PART 2");
firstSynchronizedFlash();
