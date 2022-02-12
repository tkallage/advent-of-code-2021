const { getInputLines, median } = require("../lib");

const inputLines = getInputLines();

const chunkDelimiters = new Map([
  ["(", ")"],
  ["[", "]"],
  ["{", "}"],
  ["<", ">"],
]);

const invalidityScores = new Map([
  [")", 3],
  ["]", 57],
  ["}", 1197],
  [">", 25137],
]);

const incompletenessScores = new Map([
  [")", 1],
  ["]", 2],
  ["}", 3],
  [">", 4],
]);

function getErrorScores(line) {
  const expectedClosingChars = [];
  for (const char of line) {
    if (chunkDelimiters.has(char)) {
      expectedClosingChars.unshift(chunkDelimiters.get(char));
    } else if (char === expectedClosingChars[0]) {
      expectedClosingChars.shift();
    } else {
      console.log(`invalid: expected ${expectedClosingChars[0]}, got ${char}`);
      return { invalidityScore: invalidityScores.get(char) };
    }
  }

  if (expectedClosingChars.length !== 0) {
    console.log(`incomplete: ${expectedClosingChars.join("")}`);
    return {
      incompletenessScore: calculateIncompletenessScore(expectedClosingChars),
    };
  }
  return {};
}

function calculateIncompletenessScore(expectedClosingChars) {
  return expectedClosingChars.reduce((score, char) => {
    return score * 5 + incompletenessScores.get(char);
  }, 0);
}

const totalErrorScores = inputLines.reduce(
  (scores, line) => {
    const errorScores = getErrorScores(line);
    if (errorScores.invalidityScore) {
      scores.invalidityScore += errorScores.invalidityScore;
    }
    if (errorScores.incompletenessScore) {
      scores.incompletenessScores.push(errorScores.incompletenessScore);
    }

    return scores;
  },
  { invalidityScore: 0, incompletenessScores: [] }
);

console.log(`invalididy score: ${totalErrorScores.invalidityScore}`);
console.log(
  `incompleteness score: ${median(totalErrorScores.incompletenessScores)}`
);
