const fs = require("fs");
const { partition } = require("lodash");

const inputLines = fs
  .readFileSync(process.argv[2])
  .toString()
  .split(/\r?\n/)
  .filter((x) => !!x);

const lines = inputLines.map((inputLine) => {
  const m = inputLine.match(/(\d+),(\d+) -> (\d+),(\d+)/);

  return {
    x0: parseInt(m[1], 10),
    y0: parseInt(m[2], 10),
    x1: parseInt(m[3], 10),
    y1: parseInt(m[4], 10),
  };
});

const [easyLines, diagonalLines] = partition(
  lines,
  (line) => line.x0 === line.x1 || line.y0 === line.y1
);

const linesAtCoord = {};

easyLines.forEach((line) => {
  const xmin = Math.min(line.x0, line.x1);
  const ymin = Math.min(line.y0, line.y1);
  const xmax = Math.max(line.x0, line.x1);
  const ymax = Math.max(line.y0, line.y1);
  for (let x = xmin; x <= xmax; x++) {
    for (let y = ymin; y <= ymax; y++) {
      const coord = `${x},${y}`;
      linesAtCoord[coord] = (linesAtCoord[coord] ?? 0) + 1;
    }
  }
});

const moreThan2EasyLinesOverlap = Object.entries(linesAtCoord).filter(
  ([coord, nLines]) => nLines > 1
).length;

diagonalLines.forEach((line) => {
  let x = line.x0;
  let y = line.y0;
  const xstep = line.x1 < line.x0 ? -1 : 1;
  const ystep = line.y1 < line.y0 ? -1 : 1;
  for (;;) {
    const coord = `${x},${y}`;
    linesAtCoord[coord] = (linesAtCoord[coord] ?? 0) + 1;
    if (x === line.x1 && y === line.y1) {
      break;
    }
    x += xstep;
    y += ystep;
  }
});

const moreThan2LinesOverlap = Object.entries(linesAtCoord).filter(
  ([coord, nLines]) => nLines > 1
).length;

console.log({ moreThan2EasyLinesOverlap, moreThan2LinesOverlap });
