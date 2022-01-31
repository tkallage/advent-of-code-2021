const fs = require("fs");
const { sum } = require("lodash");

BINGO_DIM = 5;

const lines = fs.readFileSync(process.argv[2]).toString().split(/\r?\n/);

const inputs = lines[0].split(",").map((num) => parseInt(num, 10));

/**
 * @type {(number | null)[][][]}
 */
let bingos = [];
let iLine = 1;
while (iLine < lines.length) {
  if (!lines[iLine]) {
    iLine++;
    continue;
  }

  const bingo = lines.slice(iLine, iLine + BINGO_DIM).map((line) => {
    return Array.from(line.matchAll(/\d+/g)).map((match) =>
      parseInt(match[0], 10)
    );
  });

  bingos.push(bingo);
  iLine += BINGO_DIM;
}

/**
 *
 * @param {(number | null)[][]} bingo
 */
function isBingo(bingo) {
  for (let i = 0; i < BINGO_DIM; i++) {
    const rowWon = bingo[i].every((num) => num === null);
    const colWon = bingo.every((row) => row[i] === null);

    if (rowWon || colWon) {
      return true;
    }
  }

  return false;
}

/**
 *
 * @param {(number | null)[][][]} bingos
 */
function getWinningBingos(bingos) {
  return bingos.filter(isBingo);
}

/**
 *
 * @param {(number | null)[][][]} bingos
 * @param {number} input
 */
function applyInputToBingos(bingos, input) {
  return bingos.map((bingo) =>
    bingo.map((row) => row.map((num) => (num === input ? null : num)))
  );
}

/**
 *
 * @param {(number|null)[][]} bingo
 * @param {number} lastInput
 */
function calculateWinningScore(bingo, lastInput) {
  return sum(bingo.flat()) * lastInput;
}

let firstWinner = undefined;
let firstWinnerScore = undefined;
let lastWinner = undefined;
let lastWinnerScore = undefined;

for (const input of inputs) {
  console.log(input);
  bingos = applyInputToBingos(bingos, input);
  const winningBingos = getWinningBingos(bingos);
  if (winningBingos.length === 0) {
    continue;
  }
  if (!firstWinner && winningBingos.length > 0) {
    firstWinner = winningBingos[0];
    firstWinnerScore = calculateWinningScore(firstWinner, input);
  }
  bingos = bingos.filter((bingo) => !winningBingos.includes(bingo));
  if (bingos.length === 0) {
    lastWinner = winningBingos[winningBingos.length - 1];
    lastWinnerScore = calculateWinningScore(lastWinner, input);
  }

  if (firstWinner && lastWinner) {
    break;
  }
}

console.log({ firstWinner, firstWinnerScore, lastWinner, lastWinnerScore });
