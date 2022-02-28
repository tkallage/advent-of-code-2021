import { getInputLines } from "./lib";

function main(inputpath: string) {
  console.log("=====");
  console.log(inputpath);
  console.log("=====");

  const inputLines = getInputLines(inputpath);

  solve(inputLines);
}

main("20_input_example.txt");
main("20_input.txt");

interface ImageDimensions {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

function solve(inputLines: string[]) {
  const enhancementAlg = inputLines[0];

  let image = parseImage(inputLines.slice(1));
  console.log(`original:`);
  console.log(
    imageToStringFixed(
      image,
      0,
      inputLines.length - 2,
      0,
      inputLines.length - 2
    ) === inputLines.slice(1).join("\n")
  );
  console.log({ litPixels: countLitPixels(image) });

  Array.from({ length: 50 }).forEach((_, i) => {
    console.time(`after step ${i}:`);
    image = enhance(image, enhancementAlg);

    console.timeEnd(`after step ${i}:`);
    console.log({ litPixels: countLitPixels(image) });
  });
}

function parseImage(lines: string[]): Set<string> {
  const coords = new Set<string>();
  lines.forEach((line, y) => {
    line.split("").forEach((char, x) => {
      if (char === "#") {
        coords.add(coordString(x, y));
      }
    });
  });
  return coords;
}

function imageToString(image: Set<string>, padding = 0): string {
  const { minX, maxX, minY, maxY } = getImageDimensions(image);

  return imageToStringFixed(
    image,
    minX - padding,
    maxX + padding,
    minY - padding,
    maxY + padding
  );
}

function imageToStringFixed(
  image: Set<string>,
  minXOutput: number,
  maxXOutput: number,
  minYOutput: number,
  maxYOutput: number
): string {
  const { minX, maxX, minY, maxY } = getImageDimensions(image);

  let s = "";
  for (let y = minYOutput; y <= maxYOutput; y++) {
    for (let x = minXOutput; x <= maxXOutput; x++) {
      if (x < minX || x > maxX || y < minY || y > maxY) {
        s += image.has("outside") ? "#" : ".";
      } else {
        s += image.has(coordString(x, y)) ? "#" : ".";
      }
    }
    if (y !== maxYOutput) {
      s += "\n";
    }
  }
  return s;
}

function getImageDimensions(image: Set<string>): ImageDimensions {
  const coords = [...image]
    .filter((coord) => coord !== "outside")
    .map((coord) => {
      const coordNum = coord.split(",").map((c) => parseInt(c, 10));
      return { x: coordNum[0], y: coordNum[1] };
    });
  const minX = Math.min(...coords.map((coord) => coord.x));
  const maxX = Math.max(...coords.map((coord) => coord.x));
  const minY = Math.min(...coords.map((coord) => coord.y));
  const maxY = Math.max(...coords.map((coord) => coord.y));

  return { minX, maxX, minY, maxY };
}

function enhance(image: Set<string>, alg: string): Set<string> {
  const imgDim = getImageDimensions(image);

  const enhancedImage = new Set<string>();
  for (let y = imgDim.minY - 1; y <= imgDim.maxY + 1; y++) {
    for (let x = imgDim.minX - 1; x <= imgDim.maxX + 1; x++) {
      if (isEnhancedLight(image, alg, x, y, imgDim)) {
        enhancedImage.add(coordString(x, y));
      }
    }
  }
  if (image.has("outside") && alg[0b111111111] === "#") {
    enhancedImage.add("outside");
  }
  if (!image.has("outside") && alg[0] === "#") {
    enhancedImage.add("outside");
  }

  return enhancedImage;
}

function coordString(x: number, y: number): string {
  return `${x},${y}`;
}

function countLitPixels(image: Set<string>): number {
  return image.has("outside") ? Infinity : image.size;
}

function isEnhancedLight(
  image: Set<string>,
  alg: string,
  x: number,
  y: number,
  imgDim: ImageDimensions
): boolean {
  let inputPixels = [];

  for (let yy = y - 1; yy < y + 1; yy++) {
    for (let xx = x - 1; xx < x + 1; xx++) {
      if (
        xx < imgDim.minX ||
        xx > imgDim.maxX ||
        yy < imgDim.minY ||
        yy > imgDim.maxY
      ) {
        inputPixels.push(image.has("outside") ? "1" : "0");
      } else {
        inputPixels.push(image.has(coordString(xx, yy)) ? "1" : "0");
      }
    }
  }

  const algIdx = parseInt(inputPixels.join(""), 2);

  if (algIdx < 0 || algIdx >= alg.length) {
    throw Error(`Out of bounds error: ${algIdx}`);
  }

  return alg[algIdx] === "#";
}
