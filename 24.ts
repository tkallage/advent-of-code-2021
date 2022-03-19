import { chunk } from "lodash";
import { getInputLines } from "./lib";

function main(inputpath: string) {
  console.log("=====");
  console.log(inputpath);
  console.log("=====");

  const inputLines = getInputLines(inputpath);

  solve(inputLines, "max");
  solve(inputLines, "min");
}

function solve(inputLines: string[], minMax: "min" | "max", v = false) {
  const stages = getStages(inputLines);
  const p = getStageParams(inputLines);

  const inputs = [...Array.from({ length: 14 })].map((): number =>
    minMax === "max" ? 9 : 1
  );

  let z = 0;
  let stagePtr = 0;
  const sourceOfDigit = [...Array.from({ length: 14 })].map(
    (): number | undefined => undefined
  );

  while (true) {
    const stage = stages[stagePtr];
    if (!stage) {
      break;
    }
    v && console.log([...zToStr(z)].map((s) => s.padStart(2)).join(""));
    v &&
      console.log(
        sourceOfDigit.map((x) => x?.toString().padStart(2) ?? " x").join(""),
        "(source)"
      );
    const { a, b, c } = p[stagePtr];
    const w = inputs[stagePtr];
    const lastDigit26 = z % 26;
    const nDigits = Math.ceil(Math.log(z + (1 - 1e-6)) / Math.log(26));

    if (a !== 26) {
      v && console.log(`#${stagePtr}`, `>> add ${w + c} (${zToStr(w + c)})`);
      z = stage(z, w);
      sourceOfDigit[nDigits] = stagePtr;
      stagePtr++;
      continue;
    }

    const bestInput = lastDigit26 + b;
    v && console.log(`#${stagePtr}`, `<< best would be ${bestInput}`);
    if (bestInput >= 1 && bestInput <= 9) {
      v && console.log(`valid`);
      inputs[stagePtr] = bestInput;
      v && console.log(`new inputs`, inputs.join(""));
      z = stage(z, bestInput);
      sourceOfDigit[nDigits - 1] = undefined;
      stagePtr++;
    } else {
      v && console.log(`invalid`);
      const idxOfInputToChange = sourceOfDigit[nDigits - 1];
      if (idxOfInputToChange === undefined) {
        v &&
          console.log(
            `idxOfInputToChange[${nDigits - 1}] = ${idxOfInputToChange}`
          );
        throw Error();
      }
      v &&
        console.log(
          `reduce input at ${idxOfInputToChange}: ${
            inputs[idxOfInputToChange]
          } => ${inputs[idxOfInputToChange] - 1}`
        );
      v && console.log(`restart with updated initial inputs`);
      if (minMax === "max") {
        inputs[idxOfInputToChange] -= 1;
      } else {
        inputs[idxOfInputToChange] += 1;
      }
      if (inputs[idxOfInputToChange] > 9 || inputs[idxOfInputToChange] < 1) {
        throw Error();
      }
      v && console.log(`new inputs`, inputs.join(""));
      // restart
      stagePtr = 0;
      z = 0;
      sourceOfDigit.forEach((_, i) => (sourceOfDigit[i] = undefined));
    }
  }

  console.log(`Found ${minMax} serial number:`);

  console.log(inputs.join(""));
}

function zToStr(z: number) {
  // let stack = [];
  // let i = 0;
  // const digits = Math.ceil(Math.log(z + (1 - 1e-6)) / Math.log(26))
  // v && console.log(`digits`, digits)
  // do {
  //   const lastDigitInBase26 = z % 26;
  //   // const char = String.fromCharCode("A".charCodeAt(0) + lastDigitInBase26);
  //   // stack.shift(char);
  //   stack.unshift(lastDigitInBase26.toString().padStart(2, " "));
  //   z = roundTowardsZero(z / 26);
  //   i++
  // } while (z !== 0 && z !== -0 && i < digits);
  // return stack.join(',')
  return z.toString(26);
}

function createFn_(
  a: number,
  b: number,
  c: number
): (z: number, w: number) => number {
  return (z: number, w: number): number => {
    let x = z % 26;

    z /= a;
    z = z < 0 ? Math.ceil(z) : Math.floor(z);

    if (x !== w - b) {
      z = z * 26 + w + c;
    }

    return z;
  };
}

function getStages(inputLines: string[]): ((z: number, w: number) => number)[] {
  return getStageParams(inputLines).map((p) => createFn_(p.a, p.b, p.c));
}

function getStageParams(inputLines: string[]) {
  return chunk(inputLines, 18).map((lines) => {
    const a = parseInt(lines[4].split(" ")[2], 10);
    const b = parseInt(lines[5].split(" ")[2], 10);
    const c = parseInt(lines[15].split(" ")[2], 10);
    return { a, b, c };
  });
}

main("24_input.txt");
