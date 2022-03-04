import { getInputLines } from "./lib";

function main(inputpath: string) {
  console.log("=====");
  console.log(inputpath);
  console.log("=====");

  const inputLines = getInputLines(inputpath);

  solve(inputLines);
}

const possibleThreeDiceRolls = [
  { roll: 3, count: BigInt(1) },
  { roll: 4, count: BigInt(3) },
  { roll: 5, count: BigInt(6) },
  { roll: 6, count: BigInt(7) },
  { roll: 7, count: BigInt(6) },
  { roll: 8, count: BigInt(3) },
  { roll: 9, count: BigInt(1) },
];

function solve(inputLines: string[]) {
  const startingPositions = parseInput(inputLines);

  /**
   * posA,posB:scoreA,scoreB
   */
  let universes = {
    [startingPositions.join(",") + ":0,0"]: BigInt(1),
  };
  const wins = [BigInt(0), BigInt(0)];

  for (let i = 0; i < 10000 && Object.keys(universes).length > 0; i++) {
    for (const player of [0, 1] as const) {
      const newUniverses: typeof universes = {};
      for (const [uniKey, uniCount] of Object.entries(universes)) {
        const [posStr, scoresStr] = uniKey.split(":");
        const pos = posStr.split(",").map((x) => parseInt(x, 10));
        const scores = scoresStr.split(",").map((x) => parseInt(x, 10));
        for (const threeDiceRoll of possibleThreeDiceRolls) {
          const thisBranchUniCount = uniCount * threeDiceRoll.count;
          const newPos = [...pos];
          const newScores = [...scores];
          newPos[player] = ((pos[player] + threeDiceRoll.roll - 1) % 10) + 1;
          newScores[player] += newPos[player];
          if (newScores[player] >= 21) {
            wins[player] += thisBranchUniCount;
          } else {
            const newUniKey = `${newPos.join(",")}:${newScores.join(",")}`;
            if (!(newUniKey in newUniverses)) {
              newUniverses[newUniKey] = thisBranchUniCount;
            } else {
              newUniverses[newUniKey] += thisBranchUniCount;
            }
          }
        }
      }
      universes = newUniverses;
    }
  }
  console.log({
    "wins player 1": wins[0].toString(),
    "wins player 2": wins[1].toString(),
  });
}

function parseInput(inputLines: string[]): [number, number] {
  return [
    parseInt(inputLines[0][inputLines[0].length - 1], 10),
    parseInt(inputLines[1][inputLines[1].length - 1], 10),
  ];
}

main("21_input_example.txt");
main("21_input.txt");
