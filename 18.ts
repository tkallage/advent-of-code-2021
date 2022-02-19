import { getInputLines } from "./lib";

function main(inputpath: string) {
  console.log("=====");
  console.log(inputpath);
  console.log("=====");

  const inputLines = getInputLines(inputpath);

  solve(inputLines);
}

let v = false;

main("18_input_example.txt");
main("18_input.txt");

function solve(inputLines: string[]) {
  let result = inputLines[0];
  inputLines.slice(1).forEach((snum) => {
    // v = snum === "[2,9]";
    v && console.log(" ", result);
    v && console.log("+", snum);
    result = add(result, snum);
    v && console.log("=", result);
    v && console.log("-------");
    // v = false;
  });

  console.log({ totalSumMagnitude: magnitude(result) });

  let maxMagnitude = 0;
  for (let i = 0; i < inputLines.length; i++) {
    for (let j = 0; j < inputLines.length; j++) {
      const sum = add(inputLines[i], inputLines[j]);
      const mag = magnitude(sum);
      if (maxMagnitude < mag) {
        maxMagnitude = mag;
      }
    }
  }
  console.log({ maxMagnitude });
}

function add(a: string, b: string): string {
  let result: string = `[${a},${b}]`;
  let reduced = false;
  do {
    const reducedResult = tryReduce(result);
    if (reducedResult) {
      reduced = true;
      result = reducedResult;
    } else {
      reduced = false;
    }
  } while (reduced);

  return result;
}

function tryReduce(str: string): string | null {
  return tryExplode(str) || trySplit(str);
}

function tryExplode(str: string): string | null {
  let exploded = false;
  let result = str;

  let depth = 0;
  for (let i = 0; i < result.length; i++) {
    if (result[i] === "[") {
      depth++;
    } else if (result[i] === "]") {
      depth--;
    }
    if (depth > 4) {
      const closing = i + result.slice(i).indexOf("]");
      const [a, b] = result
        .slice(i + 1, closing)
        .split(",")
        .map((s) => parseInt(s, 10));

      const nextNumRightStart =
        [...result.slice(closing)].findIndex((c) => /\d/.test(c)) + closing;
      const nextNumRightEnd =
        nextNumRightStart +
        [...result.slice(nextNumRightStart)].findIndex((c) => /[^\d]/.test(c));
      const nextNumLeftEnd =
        i - [...result.slice(0, i)].reverse().findIndex((c) => /\d/.test(c));
      const nextNumLeftStart =
        nextNumLeftEnd -
        [...result.slice(0, nextNumLeftEnd)]
          .reverse()
          .findIndex((c) => /[^\d]/.test(c));

      v && log(result + " exploding...", [i, closing + 1]);

      if (nextNumRightStart > closing) {
        const updatedNumRight =
          parseInt(result.slice(nextNumRightStart, nextNumRightEnd), 10) + b;
        result = [
          result.slice(0, nextNumRightStart),
          updatedNumRight,
          result.slice(nextNumRightEnd),
        ].join("");
      }
      result = [result.slice(0, i), "0", result.slice(closing + 1)].join("");
      if (nextNumLeftEnd < i) {
        const updatedNumLeft =
          parseInt(result.slice(nextNumLeftStart, nextNumLeftEnd), 10) + a;
        result = [
          result.slice(0, nextNumLeftStart),
          updatedNumLeft,
          result.slice(nextNumLeftEnd),
        ].join("");
      }
      v && console.log(result);
      exploded = true;
      break;
    }
  }

  if (exploded) {
    return result;
  } else {
    return null;
  }
}

function trySplit(str: string): string | null {
  const largeNum = str.match(/\d{2}/g);
  if (largeNum) {
    const largeNumStart = str.indexOf(largeNum[0]);
    const largeNumEnd =
      largeNumStart +
      [...str].slice(largeNumStart).findIndex((c) => /[^\d]/.test(c));
    v && log(str + " splitting...", [largeNumStart, largeNumEnd]);
    const num = parseInt(str.slice(largeNumStart, largeNumEnd), 10);
    const splitted = `[${Math.floor(num / 2)},${Math.ceil(num / 2)}]`;
    const result = [
      str.slice(0, largeNumStart),
      splitted,
      str.slice(largeNumEnd),
    ].join("");
    v && console.log(result);
    return result;
  } else {
    return null;
  }
}

function log(msg: string, highlight: [number, number]) {
  const fullMsg = [
    msg.slice(0, highlight[0]),
    "\x1b[31m",
    msg.slice(highlight[0], highlight[1]),
    "\x1b[0m",
    msg.slice(highlight[1]),
  ].join("");
  console.log(fullMsg);
}

function magnitude(str: string): number {
  v && console.log(str);
  while (str.includes(",")) {
    const matches = str.match(/(\d+),(\d+)/g);
    matches?.forEach((match) => {
      const [a, b] = match.split(",").map((s) => parseInt(s, 10));
      const mag = 3 * a + 2 * b;
      str = str.replace(`[${match}]`, mag.toString());
      v && console.log(str);
    });
  }
  v && console.log(str);

  return parseInt(str, 10);
}
