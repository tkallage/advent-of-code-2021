import { min, partition } from "lodash";
import { getInputLines } from "./lib";

interface ScoredPath {
  path: number[];
  score: number;
}

function main(inputpath: string) {
  console.log("=====");
  console.log(inputpath);
  console.log("=====");

  const inputLines = getInputLines(inputpath);
  const xDim = inputLines[0].length;

  const riskLevels = inputLines.flatMap((line) =>
    line.split("").map((char) => parseInt(char, 10))
  );

  // printPath(riskLevels, xDim);
  const bestPath = getBestPath(riskLevels, xDim);
  // printPath(riskLevels, xDim, bestPath.path);

  const { riskLevelsB, xDimB } = getRiskLevelsB(riskLevels, xDim);

  // printPath(riskLevelsB, xDimB);
  const bestPathB = getBestPath(riskLevelsB, xDimB);
  // printPath(riskLevelsB, xDimB, bestPathB.path);
}

function getRiskLevelsB(riskLevels: number[], xDim: number) {
  const riskLevelsB = Array.from({ length: riskLevels.length * 25 }).map(
    () => 0
  );
  const xDimB = xDim * 5;
  const mappings = [
    { offsets: [0], add: 0 },
    { offsets: [1, xDimB], add: 1 },
    { offsets: [2, xDimB + 1, 2 * xDimB], add: 2 },
    { offsets: [3, xDimB + 2, 2 * xDimB + 1, 3 * xDimB], add: 3 },
    {
      offsets: [4, xDimB + 3, 2 * xDimB + 2, 3 * xDimB + 1, 4 * xDimB],
      add: 4,
    },
    {
      offsets: [xDimB + 4, 2 * xDimB + 3, 3 * xDimB + 2, 4 * xDimB + 1],
      add: 5,
    },
    { offsets: [2 * xDimB + 4, 3 * xDimB + 3, 4 * xDimB + 2], add: 6 },
    { offsets: [3 * xDimB + 4, 4 * xDimB + 3], add: 7 },
    { offsets: [4 * xDimB + 4], add: 8 },
  ];
  for (let i = 0; i < riskLevels.length; i++) {
    for (const { offsets, add } of mappings) {
      for (const offset of offsets) {
        const newIdx =
          i + Math.floor(i / xDim) * (xDimB - xDim) + xDim * offset;
        let newVal = riskLevels[i] + add;
        while (newVal > 9) {
          newVal -= +9;
        }
        riskLevelsB[newIdx] = newVal;
      }
    }
  }
  return { riskLevelsB, xDimB };
}

function printPath(riskLevels: number[], xDim: number, path?: number[]) {
  let s = "";
  let pathRiskLevel = 0;
  riskLevels.forEach((riskLevel, i) => {
    const isOnPath = !!path?.includes(i);
    if (isOnPath) {
      pathRiskLevel += riskLevel;
    }
    if (isOnPath || (path && i === 0)) {
      s += "\x1b[1m\x1b[31m";
    }
    s += riskLevel.toString();
    if (isOnPath || (path && i === 0)) {
      s += "\x1b[0m";
    }
    if ((i + 1) % xDim === 0 && i + 1 < riskLevels.length) {
      s += "\n";
    }
  });
  console.log(s);
  if (path) {
    console.log({ pathRiskLevel });
  }
}

function getBestPath(riskLevels: number[], xDim: number): ScoredPath {
  let paths: ScoredPath[] = [
    // start right
    { path: [1], score: riskLevels[1] },
    // start down
    { path: [xDim], score: riskLevels[xDim] },
  ];
  let pathsChecked = 0;
  const bestPathTo: (ScoredPath | null)[] = riskLevels.map(() => null);
  console.time("getBestPath");
  while (pathsChecked < 10000000) {
    // get path with minimal score
    const bestScore = min(paths.map((path) => path.score));
    const [bestPaths, otherPaths] = partition(
      paths,
      (path) => path.score === bestScore
    );
    paths = otherPaths;
    // console.log(
    //   `best score: ${bestScore}, best paths: ${bestPaths.length}, other paths: ${otherPaths.length}`
    // );

    for (const bestPath of bestPaths) {
      const nextPaths = getNextPaths(riskLevels, bestPath, xDim, bestPathTo);

      for (const nextPath of nextPaths) {
        if (nextPath.path[nextPath.path.length - 1] === riskLevels.length - 1) {
          console.log(`took ${pathsChecked} steps to find best path`);
          console.timeEnd("getBestPath");
          return nextPath;
        }
        paths.push(nextPath);
      }

      pathsChecked++;
    }
  }
  throw Error(`Could not find best path`);
}

function getNextPaths(
  riskLevels: number[],
  bestPath: ScoredPath,
  xDim: number,
  bestPathScoreTo: (ScoredPath | null)[]
) {
  // if ((pathsChecked + 1) % 10000 === 0) {
  //   console.log(`checking ${pathsChecked + 1}th path`);
  // }
  // calculate scores for each possible next step
  const currentPos = bestPath.path[bestPath.path.length - 1];
  const nextPositions: number[] = [];
  const right = currentPos + 1;
  const down = currentPos + xDim;
  const left = currentPos - 1;
  const up = currentPos - xDim;
  if (right % xDim !== 0) {
    nextPositions.push(right);
  }
  if (currentPos % xDim !== 0 && left > 0) {
    nextPositions.push(left);
  }
  if (down < riskLevels.length) {
    nextPositions.push(down);
  }
  if (up > 0) {
    nextPositions.push(up);
  }
  const nextPaths: ScoredPath[] = [];
  for (const nextPos of nextPositions) {
    const nextScore = bestPath.score + riskLevels[nextPos];
    const bestPathToNextPos = bestPathScoreTo[nextPos];
    if (bestPathToNextPos && nextScore >= bestPathToNextPos.score) {
      continue;
    }
    const nextPath = {
      path: [...bestPath.path, nextPos],
      score: nextScore,
    };
    if (!bestPathToNextPos || nextScore < bestPathToNextPos.score) {
      bestPathScoreTo[nextPos] = nextPath;
    }

    nextPaths.push(nextPath);
  }
  return nextPaths;
}

main("15_input_example.txt");
main("15_input.txt");
