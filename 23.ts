import { min } from "lodash";
import { getInputLines } from "./lib";

function main(inputpath: string) {
  console.log("=====");
  console.log(inputpath);
  console.log("=====");

  const inputLines = getInputLines(inputpath);

  solve(inputLines, true);
}

const energyUsagePerStep = {
  A: 1,
  B: 10,
  C: 100,
  D: 1000,
} as const;

const hallwayIdxRange = [15, 25];
const targetRoomX = {
  A: 3,
  B: 5,
  C: 7,
  D: 9,
};

const targetStateArray = [
  `#############`,
  `#...........#`,
  `###A#B#C#D###`,
  `  #A#B#C#D#`,
  `  #########`,
];
const part2Lines = [`  #D#C#B#A#`, `  #D#B#A#C#`];

function solve(inputLines: string[], part2: boolean) {
  if (part2) {
    targetStateArray.splice(3, 0, targetStateArray[3], targetStateArray[3]);
    inputLines.splice(3, 0, ...part2Lines);
  }
  const targetState = targetStateArray
    .map((line) => line.padEnd(13, " "))
    .join("\n");
  const initState = inputLines.map((line) => line.padEnd(13, " ")).join("\n");
  console.log(initState);
  console.log(targetState);
  const targetRoomIndices = {
    A: (part2 ? [2, 3, 4, 5] : [2, 3]).map((y) => y * 14 + targetRoomX.A),
    B: (part2 ? [2, 3, 4, 5] : [2, 3]).map((y) => y * 14 + targetRoomX.B),
    C: (part2 ? [2, 3, 4, 5] : [2, 3]).map((y) => y * 14 + targetRoomX.C),
    D: (part2 ? [2, 3, 4, 5] : [2, 3]).map((y) => y * 14 + targetRoomX.D),
  };

  const validSteps = getValidSteps(initState, part2);

  let bestEnergyUsage = Infinity;

  let paths: { state: string; energyUsage: number }[] = [
    { state: initState, energyUsage: 0 },
  ];
  const bestEnergyUsageTo = { [initState]: 0 };
  for (let i = 0; paths.length > 0; i++) {
    const minEnergyUsage =
      min(paths.map((path) => path.energyUsage)) ?? Infinity;
    const bestPaths = paths.filter(
      (path) => path.energyUsage === minEnergyUsage
    );

    paths = paths.filter(
      (path) =>
        path.energyUsage !== minEnergyUsage &&
        path.energyUsage < bestEnergyUsage
    );
    console.log({ minEnergyUsage, bestPaths: bestPaths.length });
    for (const path of bestPaths) {
      const nextPaths = getNextPaths(
        path.state,
        path.energyUsage,
        validSteps,
        targetRoomIndices
      );
      nextPaths.forEach((nextPath) => {
        if (
          nextPath.energyUsage < (bestEnergyUsageTo[nextPath.state] ?? Infinity)
        ) {
          bestEnergyUsageTo[nextPath.state] = nextPath.energyUsage;
          paths.push(nextPath);
        }
      });
    }
    if ((bestEnergyUsageTo[targetState] ?? Infinity) < bestEnergyUsage) {
      bestEnergyUsage = bestEnergyUsageTo[targetState] ?? Infinity;
      console.log({
        bestEnergyUsage,
      });
    }
  }
  console.log({
    bestEnergyUsage,
  });
}

function getValidSteps(
  initState: string,
  part2: boolean
): {
  [from: number]: { to: number; route: number[] }[];
} {
  const validSteps: { [from: number]: { to: number; route: number[] }[] } = {};
  initState.split("").forEach((_c, i) => {
    validSteps[i] = [];
  });
  const allTargetRoomIndices = Object.values(targetRoomX).flatMap((x) => {
    const indices: number[] = [];
    for (let y = 2; y <= (part2 ? 5 : 3); y++) {
      indices.push(y * 14 + x);
    }
    return indices;
  });
  for (let i = hallwayIdxRange[0]; i <= hallwayIdxRange[1]; i++) {
    if (allTargetRoomIndices.some((tr) => tr % 14 === i % 14)) {
      continue;
    }
    const hallwayX = i % 14;
    const hallwayY = Math.floor(i / 14);
    allTargetRoomIndices.forEach((to) => {
      const toX = to % 14;
      const toY = Math.floor(to / 14);
      const route: number[] = [];
      for (
        let x = hallwayX;
        x <= Math.max(hallwayX, toX) && x >= Math.min(hallwayX, toX);
        hallwayX < toX ? x++ : x--
      ) {
        route.push(hallwayY * 14 + x);
      }
      for (let y = hallwayY + 1; y <= toY; y++) {
        route.push(y * 14 + toX);
      }

      validSteps[i].push({ to, route });
      validSteps[to].push({ to: i, route: [...route].reverse() });
    });
  }

  return validSteps;
}

function findAllIndices(s: string, c: RegExp): number[] {
  const indices: number[] = [];

  let offset = 0;
  let rest = s;
  while (rest.length > 0) {
    const nextIdx = [...rest].findIndex((char) => c.test(char));
    if (nextIdx >= 0) {
      indices.push(offset + nextIdx);
      offset += nextIdx + 1;
      rest = s.slice(offset);
    } else {
      break;
    }
  }

  return indices;
}

function getNextPaths(
  currentState: string,
  currentEnergyUsage: number,
  validSteps: {
    [from: number]: {
      to: number;
      route: number[];
    }[];
  },
  targetRoomIndices: { [c in "A" | "B" | "C" | "D"]: number[] }
): { state: string; energyUsage: number }[] {
  // console.log(currentState);
  const nextPaths: { state: string; energyUsage: number }[] = [];

  const currentPositions = findAllIndices(currentState, /A|B|C|D/);

  for (const pos of currentPositions) {
    const c = currentState.charAt(pos) as "A" | "B" | "C" | "D";
    const targetIndices = targetRoomIndices[c];

    if (
      targetIndices.includes(pos) &&
      // following places in room (if any) are filled correctly
      (targetIndices.filter((targetIdx) => targetIdx > pos).length === 0 ||
        targetIndices
          .filter((targetIdx) => targetIdx > pos)
          .every((idx) => currentState[idx] === c))
    ) {
      continue;
    }
    const targetPos = [...targetIndices]
      .reverse()
      .find((targetIdx) => currentState[targetIdx] !== c);

    for (const step of validSteps[pos]) {
      if (
        (step.to >= hallwayIdxRange[0] && step.to <= hallwayIdxRange[1]) ||
        step.to === targetPos
      ) {
        if (
          step.route.slice(1).some((idx) => currentState.charAt(idx) !== ".")
        ) {
          continue;
        }
        const newStateArray = [...currentState];
        newStateArray[step.to] = c;
        newStateArray[pos] = ".";
        const nextPath = {
          state: newStateArray.join(""),
          energyUsage:
            currentEnergyUsage +
            (step.route.length - 1) * energyUsagePerStep[c],
        };
        // console.log(nextPath.state);
        // console.log(nextPath.energyUsage);
        if (step.to === targetPos) {
          // if any checked step moves to a target, discard all other steps
          return [nextPath];
        } else {
          nextPaths.push(nextPath);
        }
      }
    }
  }

  return nextPaths;
}

main("23_input.txt");
