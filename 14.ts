import { getInputLines } from "./lib";

function main(inputpath: string) {
  console.log("=====");
  console.log(inputpath);
  console.log("=====");

  const inputLines = getInputLines(inputpath);

  const polymerTemplate = inputLines[0];
  const pairInsertionRules = inputLines
    .slice(1)
    .reduce<Record<string, string>>((rules, line) => {
      const [pair, inserted] = line.split(" -> ");
      rules[pair] = inserted;
      return rules;
    }, {});

  // console.log({ polymerTemplate, pairInsertionRules });

  let polymerPairCounts: { [pair: string]: number | undefined } = {};
  for (let i = 0; i < polymerTemplate.length - 1; i++) {
    const polymerPair = `${polymerTemplate[i]}${polymerTemplate[i + 1]}`;
    polymerPairCounts[polymerPair] = (polymerPairCounts[polymerPair] ?? 0) + 1;
  }

  // console.log(`before`, polymerPairCounts, countPolymers(polymerPairCounts));

  for (let iStep = 0; iStep < 40; iStep++) {
    polymerPairCounts = Object.entries(polymerPairCounts).reduce<
      typeof polymerPairCounts
    >((newPolymerPairCounts, [polymerPair, count]) => {
      const insertedPolymer = pairInsertionRules[polymerPair];
      let pairs: string[] = [];
      if (insertedPolymer) {
        pairs.push(
          `${polymerPair[0]}${insertedPolymer}`,
          `${insertedPolymer}${polymerPair[1]}`
        );
      } else {
        pairs.push(polymerPair);
      }
      pairs.forEach((pair) => {
        newPolymerPairCounts[pair] =
          (newPolymerPairCounts[pair] ?? 0) + (count ?? 0);
      });

      return newPolymerPairCounts;
    }, {});
    // console.log(`after step ${iStep + 1}:`, polymerPairCounts);
    console.log(
      `step ${(iStep + 1)
        .toString()
        .padStart(2)} puzzle score = ${getPuzzleScore(polymerPairCounts)
        .toString()
        .padStart(15)}`
    );
  }
}

function countPolymers(polymerPairCounts: {
  [pair: string]: number | undefined;
}) {
  const polymerCounts = Object.entries(polymerPairCounts).reduce<
    Record<string, number>
  >((counts, [pair, count]) => {
    pair.split("").forEach((polymer) => {
      counts[polymer] = (counts[polymer] ?? 0) + (count ?? 0) / 2;
    });
    return counts;
  }, {});
  Object.keys(polymerCounts).forEach((polymer) => {
    polymerCounts[polymer] = Math.ceil(polymerCounts[polymer]);
  });

  return polymerCounts;
}

function getPuzzleScore(polymerPairCounts: {
  [pair: string]: number | undefined;
}): number {
  const counts = Object.values(countPolymers(polymerPairCounts));

  return Math.max(...counts) - Math.min(...counts);
}

main("14_input_example.txt");
main("14_input.txt");
