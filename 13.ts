import { getInputLines } from "./lib";
import { uniqBy } from "lodash";

type Dot = [number, number];
type Fold = { axis: "x" | "y"; coord: number };

function main(inputpath: string) {
  console.log("=====");
  console.log(inputpath);
  console.log("=====");

  const inputLines = getInputLines(inputpath);

  const initialDots: Dot[] = [];
  const folds: Fold[] = [];

  inputLines.forEach((line) => {
    if (line.startsWith("fold along")) {
      folds.push({
        axis: line[11] as "x" | "y",
        coord: parseInt(line.split("=")[1], 10),
      });
    } else {
      initialDots.push([
        parseInt(line.split(",")[0], 10),
        parseInt(line.split(",")[1], 10),
      ]);
    }
  });

  let dots = [...initialDots];
  console.log(`unique dots initially: ${dots.length}`);
  folds.forEach((fold, iFold) => {
    dots = foldAlong(dots, fold);
    console.log(`unique dots after fold ${iFold + 1}: ${dots.length}`);
  });

  console.log(dots);
  console.log({ count: dots.length });

  console.log(dotsToString(dots, undefined, " "), "\n");
}

function foldAlong(dots: Dot[], fold: Fold): Dot[] {
  const axis = fold.axis === "x" ? 0 : 1;
  const mapDot = (dot: Dot): Dot => {
    const newDot: Dot = [...dot];
    if (newDot[axis] > fold.coord) {
      newDot[axis] = 2 * fold.coord - newDot[axis];
    }
    return newDot;
  };

  return uniqBy(dots.map(mapDot), (dot) => dot.join());
}

function dotsToString(dots: Dot[], fold?: Fold, emptyCell = ".") {
  const maxX = Math.max(...dots.map((dot) => dot[0]));
  const maxY = Math.max(...dots.map((dot) => dot[1]));

  let s = "";
  for (let y = 0; y <= maxY; y++) {
    for (let x = 0; x <= maxX; x++) {
      if (
        fold &&
        ((fold.axis === "x" && fold.coord === x) ||
          (fold.axis === "y" && fold.coord === y))
      ) {
        s += fold.axis === "x" ? "|" : "-";
      } else if (dots.some((dot) => dot[0] === x && dot[1] === y)) {
        s += "#";
      } else {
        s += emptyCell;
      }
    }
    s += "\n";
  }

  return s.slice(0, s.length - 1);
}

main("13_input_example.txt");
main("13_input.txt");
