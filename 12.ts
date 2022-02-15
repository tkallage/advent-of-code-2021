import { getInputLines } from "./lib";

const inputLines = getInputLines("12_input.txt");

console.log(inputLines);

const connections = inputLines.reduce<Record<string, string[]>>((acc, line) => {
  const [start, dest] = line.split("-");
  (acc[start] ??= []).push(dest);
  (acc[dest] ??= []).push(start);

  return acc;
}, {});

console.log(connections);

function getNextCaves(
  connectedCaves: string[],
  visitedSmallCaves: string[],
  allowOneDoubleVisit: boolean
): string[] {
  if (allowOneDoubleVisit) {
    return connectedCaves.filter((cave) => cave !== "start");
  } else {
    return connectedCaves.filter((cave) => !visitedSmallCaves.includes(cave));
  }
}

function getDistinctPaths(
  currentPath: string[],
  allowOneDoubleVisit: boolean
): string[][] {
  const currentCave = currentPath[currentPath.length - 1];
  if (currentCave === "end") {
    return [currentPath];
  }
  const visitedSmallCaves = currentPath.filter((x) => x.toLowerCase() === x);
  const smallCaveVisitedTwice =
    visitedSmallCaves.length === new Set(visitedSmallCaves).size;
  const nextCaves = getNextCaves(
    connections[currentCave],
    visitedSmallCaves,
    allowOneDoubleVisit ? smallCaveVisitedTwice : false
  );
  const nextPaths = nextCaves.map((cave) => [...currentPath, cave]);
  return nextPaths.flatMap((path) =>
    getDistinctPaths(path, allowOneDoubleVisit)
  );
}

const allPathsA = getDistinctPaths(["start"], false);
const allPathsB = getDistinctPaths(["start"], true);

console.log({
  A: allPathsA.map((path) => path.join(",")),
  lenA: allPathsA.length,
  B: allPathsB.map((path) => path.join(",")),
  lenB: allPathsB.length,
});
