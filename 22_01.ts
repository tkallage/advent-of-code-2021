import { getInputLines } from "./lib";

function main(inputpath: string) {
  console.log("=====");
  console.log(inputpath);
  console.log("=====");

  const inputLines = getInputLines(inputpath);

  solve(inputLines);
}

function solve(inputLines: string[]) {
  const s: Record<string, boolean> = {};
  for (let x = -50; x <= 50; x++) {
    for (let y = -50; y <= 50; y++) {
      for (let z = -50; z <= 50; z++) {
        s[`${x},${y},${z}`] = false;
      }
    }
  }

  for (const line of inputLines) {
    const m = line.match(
      /(on|off) x=(-?\d+)\.\.(-?\d+),y=(-?\d+)\.\.(-?\d+),z=(-?\d+)\.\.(-?\d+)/
    );

    if (!m) {
      throw Error();
    }
    const newVal = m[1] === "on";
    // console.log(line, m, newVal);

    for (
      let x = Math.max(parseInt(m[2]), -50);
      x <= Math.min(parseInt(m[3]), 50);
      x++
    ) {
      for (
        let y = Math.max(parseInt(m[4]), -50);
        y <= Math.min(parseInt(m[5]), 50);
        y++
      ) {
        for (
          let z = Math.max(parseInt(m[6]), -50);
          z <= Math.min(parseInt(m[7]), 50);
          z++
        ) {
          s[`${x},${y},${z}`] = newVal;
        }
      }
    }
  }
  const litCubes = Object.values(s).filter((x) => x).length;
  console.log(litCubes);
}

main("22_input_example.txt");
main("22_input.txt");
