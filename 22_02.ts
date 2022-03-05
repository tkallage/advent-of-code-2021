import { getInputLines } from "./lib";

function main(inputpath: string) {
  console.log("=====");
  console.log(inputpath);
  console.log("=====");

  const inputLines = getInputLines(inputpath);

  solve(inputLines);
}

interface Area {
  x: [number, number];
  y: [number, number];
  z: [number, number];
}

function size(area: Area): number {
  return (
    (area.x[1] - area.x[0] + 1) *
    (area.y[1] - area.y[0] + 1) *
    (area.z[1] - area.z[0] + 1)
  );
}

const dims: (keyof Area)[] = ["x", "y", "z"];

function difference(a: Area, b: Area): Area[] {
  let result: Area[] = [];
  let areasToChop = [a];

  for (const dim of dims) {
    const nextAreasToChop: Area[] = [];
    for (const area of areasToChop) {
      let left: Area | null = null,
        middle: Area | null = null,
        right: Area | null = null;
      [left, middle] = chopAt(area, dim, b[dim][0]);
      if (middle) {
        [middle, right] = chopAt(middle, dim, b[dim][1] + 1);
      }

      if (left) result.push(left);
      if (middle) nextAreasToChop.push(middle);
      if (right) result.push(right);
    }
    areasToChop = nextAreasToChop;
  }

  return result.filter((area) => !isEqual(area, b));
}

function chopAt(
  area: Area,
  dim: keyof Area,
  at: number
): [Area | null, Area | null] {
  // console.log(`chop ${dim} at ${at}: ${toString(area)}`);
  let result: [Area | null, Area | null];
  if (at > area[dim][0] && at <= area[dim][1]) {
    result = [
      { ...area, [dim]: [area[dim][0], at - 1] },
      { ...area, [dim]: [at, area[dim][1]] },
    ];
  } else {
    if (at <= area[dim][0]) {
      result = [null, area];
    } else {
      result = [area, null];
    }
  }
  // console.log(
  //   `=> [${result.map((x) => (x ? "{" + toString(x) + "}" : "null"))}]`
  // );
  return result;
}

function union(a: Area, b: Area): Area[] {
  return [a, ...difference(b, a)];
}

function toString(a: Area) {
  return dims.map((dim) => `${dim}=${a[dim][0]}..${a[dim][1]}`).join();
}

function isEqual(a: Area, b: Area): boolean {
  return dims.every(
    (dim) => a[dim][0] === b[dim][0] && a[dim][1] === b[dim][1]
  );
}

function solve(inputLines: string[]) {
  let litAreas: Area[] = [];

  inputLines.forEach((line, i) => {
    console.log(
      `${i
        .toLocaleString()
        .padStart(
          inputLines.length.toLocaleString().length
        )}/${inputLines.length.toLocaleString()}`
    );
    const m = line.match(
      /(on|off) x=(-?\d+)\.\.(-?\d+),y=(-?\d+)\.\.(-?\d+),z=(-?\d+)\.\.(-?\d+)/
    );

    if (!m) {
      throw Error();
    }
    const newVal = m[1] === "on";

    const area: Area = {
      x: [parseInt(m[2]), parseInt(m[3])],
      y: [parseInt(m[4]), parseInt(m[5])],
      z: [parseInt(m[6]), parseInt(m[7])],
    };

    const part1 = false;
    if (part1) {
      if (
        area.x[0] < -50 ||
        area.x[1] > 50 ||
        area.y[0] < -50 ||
        area.y[1] > 50 ||
        area.z[0] < -50 ||
        area.z[1] > 50
      ) {
        return;
      }

      area.x[0] = Math.min(50, Math.max(-50, area.x[0]));
      area.y[0] = Math.min(50, Math.max(-50, area.y[0]));
      area.z[0] = Math.min(50, Math.max(-50, area.z[0]));
      area.x[1] = Math.min(50, Math.max(-50, area.x[1]));
      area.y[1] = Math.min(50, Math.max(-50, area.y[1]));
      area.z[1] = Math.min(50, Math.max(-50, area.z[1]));
    }

    // console.log(newVal, toString(area), size(area));

    litAreas = litAreas.flatMap((litArea) => difference(litArea, area));
    if (newVal) {
      litAreas.push(area);
    }

    console.log({ areaCount: litAreas.length });
  });
  const litCount = litAreas.reduce((sum, litArea) => sum + size(litArea), 0);
  console.log({ litCount });
}

// main("22_input_example_easy.txt");
// main("22_input_example.txt");
// main("22_input_example_2.txt");
main("22_input.txt");
