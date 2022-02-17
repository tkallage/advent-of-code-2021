import { maxBy } from "lodash";
import { getInputLines } from "./lib";

function main(inputpath: string) {
  console.log("=====");
  console.log(inputpath);
  console.log("=====");

  const inputLines = getInputLines(inputpath);

  solve(inputLines);
}

main("17_input_example.txt");
main("17_input.txt");

interface Probe {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface TargetArea {
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;
}

function solve(inputLines: string[]) {
  const targetArea = parseTargetArea(inputLines[0]);

  let highestTrajectory: { highestPoint: number; trajectory: Probe[] } = {
    highestPoint: -Infinity,
    trajectory: [],
  };
  const allTrajectories: Probe[][] = [];
  for (let vx = 0; vx <= targetArea.xmax; vx++) {
    for (let vy = targetArea.ymin; vy < 5000; vy++) {
      const trajectory = calcHitTrajectory({ x: 0, y: 0, vx, vy }, targetArea);

      if (trajectory) {
        allTrajectories.push(trajectory);
        let highestPoint = -Infinity;
        for (const point of trajectory) {
          if (point.y > highestPoint) {
            highestPoint = point.y;
          } else {
            break;
          }
        }
        if (highestTrajectory.highestPoint < highestPoint) {
          highestTrajectory = { trajectory, highestPoint };
        }
      }
    }
  }

  console.log({ highestTrajectory: highestTrajectory.highestPoint });
  console.log(`trajectories`, allTrajectories.length);
  console.log(
    `trajectories max vx`,
    Math.max(
      ...allTrajectories.map((traj) =>
        Math.max(...traj.map((probe) => probe.vx))
      )
    )
  );
  console.log(
    `trajectories max vy`,
    Math.max(
      ...allTrajectories.map((traj) =>
        Math.max(...traj.map((probe) => probe.vy))
      )
    )
  );
}

function parseTargetArea(str: string): TargetArea {
  const m = str.match(
    /target area: x=(-?\d+)\.\.(-?\d+), y=(-?\d+)\.\.(-?\d+)/
  );
  if (!m) {
    throw Error("Could not parse target area");
  }

  return {
    xmin: parseInt(m[1], 10),
    xmax: parseInt(m[2], 10),
    ymin: parseInt(m[3], 10),
    ymax: parseInt(m[4], 10),
  };
}

function calcHitTrajectory(
  probe: Probe,
  targetArea: TargetArea
): Probe[] | undefined {
  const traj = [{ ...probe }];

  while (probe.x <= targetArea.xmax) {
    probe = trajectoryStep(probe);
    traj.push(probe);
    if (
      probe.x >= targetArea.xmin &&
      probe.x <= targetArea.xmax &&
      probe.y >= targetArea.ymin &&
      probe.y <= targetArea.ymax
    ) {
      return traj;
    }
    if (probe.x < targetArea.xmin && probe.vx === 0) {
      return undefined;
    }
    if (probe.y < targetArea.ymin && probe.vy <= 0) {
      return undefined;
    }
  }

  return undefined;
}

function trajectoryStep(probe: Probe): Probe {
  return {
    x: probe.x + probe.vx,
    y: probe.y + probe.vy,
    vx: probe.vx > 0 ? probe.vx - 1 : probe.vx < 0 ? probe.vx + 1 : 0,
    vy: probe.vy - 1,
  };
}

function printProbe(probe: Probe): void {
  console.log(
    `x =`,
    probe.x.toString().padStart(3),
    `y =`,
    probe.y.toString().padStart(3),
    `vy =`,
    probe.vy.toString().padStart(3),
    `vy =`,
    probe.vy.toString().padStart(3)
  );
}
