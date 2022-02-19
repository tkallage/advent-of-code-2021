import { getInputLines } from "./lib";

function main(inputpath: string) {
  console.log("=====");
  console.log(inputpath);
  console.log("=====");

  const inputLines = getInputLines(inputpath);

  solve(inputLines);
}

let v = 3;

type Position = { [coord in Coord]: number };

interface Scanner {
  id: number;
  detectedPositionsRelative: Position[];
  position?: Position;
}

type Coord = "x" | "y" | "z";

main("19_input_example.txt");
main("19_input.txt");

function solve(inputLines: string[]) {
  const scanners = parseInput(inputLines);
  scanners[0].position = { x: 0, y: 0, z: 0 };

  const matchedScanners = [scanners[0]];
  const unmatchedScanners = scanners.slice(1);

  const triedPairs = new Set<string>();

  while (unmatchedScanners.length > 0) {
    m: for (const nextUnmatchedScanner of unmatchedScanners) {
      for (const matchedScanner of [...matchedScanners].reverse()) {
        const ids = [nextUnmatchedScanner.id, matchedScanner.id];
        const pairStr = `${Math.min(...ids)},${Math.max(...ids)}`;
        if (triedPairs.has(pairStr)) {
          continue;
        } else {
          triedPairs.add(pairStr);
        }
        const match = tryToMatchScanner(matchedScanner, nextUnmatchedScanner);
        if (match) {
          unmatchedScanners.splice(
            unmatchedScanners.indexOf(nextUnmatchedScanner),
            1
          );
          matchedScanners.push(match);
          console.log(
            matchedScanners.length,
            `matched scanners`,
            matchedScanners.map((s) => s.id)
          );
          console.log(
            unmatchedScanners.length,
            `unmatched scanners`,
            unmatchedScanners.map((s) => s.id)
          );
          break m;
        }
      }
    }
  }

  const allPositions = matchedScanners.flatMap((scanner) =>
    getAbsoluteBeaconPositions(scanner)
  );

  console.log(
    `unique beacon positions : ${
      new Set(allPositions.map((pos) => getPositionKey(pos))).size
    }`
  );

  const maxDistance = getMaxDistance(matchedScanners);

  console.log(`max distance between scanners`, maxDistance);
}

function parseInput(inputLines: string[]): Scanner[] {
  const scanners: Scanner[] = [];
  let currentScannerPositions: Position[] = [];
  inputLines.forEach((line) => {
    const m = line.match(/--- scanner (\d+) ---/);
    if (m) {
      currentScannerPositions = [];
      scanners.push({
        detectedPositionsRelative: currentScannerPositions,
        id: parseInt(m[1], 10),
      });
      return;
    }
    const [x, y, z] = line.split(",").map((s) => parseInt(s, 10));
    currentScannerPositions.push({ x, y, z });
  });

  return scanners;
}

function getPossibleRotations(positions: Position[]): Position[][] {
  const getRotationFunctions = (
    c1: Coord,
    c2: Coord
  ): ((pos: Position) => Position)[] => {
    return [
      (pos: Position) => ({ ...pos, [c1]: pos[c1], [c2]: pos[c2] }),
      (pos: Position) => ({ ...pos, [c1]: pos[c2], [c2]: -pos[c1] }),
      (pos: Position) => ({ ...pos, [c1]: -pos[c1], [c2]: -pos[c2] }),
      (pos: Position) => ({ ...pos, [c1]: -pos[c2], [c2]: pos[c1] }),
    ];
  };

  const rotatedPositions: Position[][] = [];
  for (const xRot of getRotationFunctions("y", "z")) {
    const rotatedX = positions.map((pos) => xRot(pos));
    for (const yRot of getRotationFunctions("z", "x")) {
      const rotatedY = rotatedX.map((pos) => yRot(pos));
      for (const zRot of getRotationFunctions("x", "y")) {
        const rotatedZ = rotatedY.map((pos) => zRot(pos));
        rotatedPositions.push(rotatedZ);
      }
    }
  }

  // drop duplicates
  const uniqueRotations = rotatedPositions.filter(
    (rot) =>
      rotatedPositions.find((other) => getRotKey(rot) === getRotKey(other)) ===
      rot
  );

  return uniqueRotations;
}

function getRotKey(rot: Position[]): string {
  return getPositionKey(rot[0]);
}

function getPositionKey(position: Position): string {
  return [position.x, position.y, position.z].join();
}

function tryToMatchScanner(a: Scanner, b: Scanner): Scanner | undefined {
  console.log(`try to match ${a.id} and ${b.id}`);
  const aPos = a.position ?? { x: 0, y: 0, z: 0 };
  const aPositions = a.detectedPositionsRelative;
  const possibleRotationsB = getPossibleRotations(b.detectedPositionsRelative);

  for (const bPositions of possibleRotationsB) {
    // align one pair
    for (const posA of aPositions) {
      for (const posB of bPositions) {
        const delta: Position = {
          x: posA.x - posB.x,
          y: posA.y - posB.y,
          z: posA.z - posB.z,
        };
        // check if 12 other pairs match up
        const matches = bPositions.filter((otherBPos) =>
          aPositions.some(
            (otherAPos) =>
              otherBPos.x + delta.x === otherAPos.x &&
              otherBPos.y + delta.y === otherAPos.y &&
              otherBPos.z + delta.z === otherAPos.z
          )
        );

        // determine absolute position of b
        if (matches.length >= 12) {
          console.log(`found ${matches.length} matches`);
          console.log(
            possibleRotationsB.findIndex(
              (otherRotation) =>
                getRotKey(bPositions) === getRotKey(otherRotation)
            )
          );
          console.log(`found scanner ${b.id}`, { delta });
          const bPos: Position = {
            x: aPos.x + delta.x,
            y: aPos.y + delta.y,
            z: aPos.z + delta.z,
          };
          return {
            position: bPos,
            detectedPositionsRelative: bPositions,
            id: b.id,
          };
        }
      }
    }
  }

  return undefined;
}

function getAbsoluteBeaconPositions(scanner: Scanner): Position[] {
  const scannerPos = scanner.position;
  if (!scannerPos) {
    throw Error("Absolute position of scanner not given");
  }
  return scanner.detectedPositionsRelative.map((pos) => ({
    x: scannerPos.x + pos.x,
    y: scannerPos.y + pos.y,
    z: scannerPos.z + pos.z,
  }));
}

function getMaxDistance(scanners: Scanner[]): {
  maxDistance: number;
  maxDistanceScanners: Omit<Scanner, "detectedPositionsRelative">[];
} {
  let maxDistance = 0;
  let maxDistanceScanners: Omit<Scanner, "detectedPositionsRelative">[] = [];

  for (const scannerA of scanners) {
    for (const scannerB of scanners) {
      const distance =
        Math.abs(scannerA.position!.x - scannerB.position!.x) +
        Math.abs(scannerA.position!.y - scannerB.position!.y) +
        Math.abs(scannerA.position!.z - scannerB.position!.z);
      if (distance > maxDistance) {
        maxDistance = distance;
        maxDistanceScanners = [
          { id: scannerA.id, position: scannerA.position! },
          { id: scannerB.id, position: scannerB.position! },
        ];
      }
    }
  }

  return { maxDistance, maxDistanceScanners };
}
