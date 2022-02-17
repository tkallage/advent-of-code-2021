import { getInputLines } from "./lib";

function main(inputpath: string) {
  console.log("=====");
  console.log(inputpath);
  console.log("=====");

  const inputLines = getInputLines(inputpath);

  solve(inputLines);
}

// main("16_input_examples.txt");
main("16_input.txt");

interface PacketResult {
  value: number;
  length: number;
  versionSum?: number;
}

function solve(inputLines: string[]) {
  for (const hexInput of inputLines) {
    const binInput = hexToBin(hexInput);
    console.log(":: INPUT");
    console.log({ hexInput, binInput });
    console.log(":: OUTPUT");

    const parsed = parsePacket(binInput);

    console.log({ parsed });
  }
}

function hexToBin(hexStr: string): string {
  return hexStr
    .split("")
    .map((hexChar) => parseInt(hexChar, 16).toString(2).padStart(4, "0"))
    .join("");
}

function parsePacket(binStr: string): PacketResult {
  // console.log(`* parsePacket(       ${binStr} )`);

  const version = parseInt(binStr.slice(0, 3), 2);
  const typeId = parseInt(binStr.slice(3, 6), 2);
  const packetContent = binStr.slice(6);
  let result: PacketResult;
  if (typeId === 4) {
    result = parseLiteralValue(packetContent);
  } else {
    result = parseOperator(packetContent, typeId);
  }
  return {
    value: result.value,
    length: result.length + 6,
    versionSum: version + (result.versionSum ?? 0),
  };
}

function parseLiteralValue(binStr: string): PacketResult {
  // console.log(`* parseLiteralValue( ${binStr} )`);

  let valueBinStr = "";
  let length = 0;
  for (let i = 0; i < binStr.length; i += 5) {
    valueBinStr += binStr.slice(i + 1, i + 5);
    length = i + 5;
    if (binStr[i] === "0") {
      break;
    }
  }
  if (length === 0) {
    throw Error("length is 0");
  }

  return { value: parseInt(valueBinStr, 2), length };
}

function parseOperator(binStr: string, typeId: number): PacketResult {
  // console.log(`* parseOperator(     ${binStr} )`);

  const lengthTypeId = parseInt(binStr[0], 2);
  let offset = 0;
  let values: number[] = [];
  let totalVersionSum = 0;
  if (lengthTypeId === 0) {
    const totalSubpacketBits = parseInt(binStr.slice(1, 16), 2);
    // console.log({ totalSubpacketBits });
    offset = 16;

    while (offset < 16 + totalSubpacketBits) {
      const { value, length, versionSum } = parsePacket(binStr.slice(offset));
      offset += length;
      values.push(value);
      totalVersionSum += versionSum ?? 0;
    }
  } else if (lengthTypeId === 1) {
    const subpacketCount = parseInt(binStr.slice(1, 12), 2);
    offset = 12;
    // console.log({ subpacketCount });

    for (let iSubpacket = 0; iSubpacket < subpacketCount; iSubpacket++) {
      const { value, length, versionSum } = parsePacket(binStr.slice(offset));
      offset += length;
      values.push(value);
      totalVersionSum += versionSum ?? 0;
    }
  } else {
    throw Error(`Error while parsing operator packet: '${binStr}'`);
  }
  let result: number;
  if (typeId === 0) {
    // sum
    result = values.reduce((acc, value) => acc + value, 0);
  } else if (typeId === 1) {
    // product
    result = values.reduce((acc, value) => acc * value, 1);
  } else if (typeId === 2) {
    // minimum
    result = Math.min(...values);
  } else if (typeId === 3) {
    // maximum
    result = Math.max(...values);
  } else if (typeId === 5) {
    // greater than
    result = +(values[0] > values[1]);
  } else if (typeId === 6) {
    // less than
    result = +(values[0] < values[1]);
  } else if (typeId === 7) {
    // equal to
    result = +(values[0] === values[1]);
  } else {
    throw Error(`Invalid typeId ${typeId}`);
  }

  console.log({ values, typeId, result });

  return {
    value: result,
    length: offset,
    versionSum: totalVersionSum,
  };
}
