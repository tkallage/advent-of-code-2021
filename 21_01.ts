import { getInputLines } from "./lib";

function main(inputpath: string) {
  console.log("=====");
  console.log(inputpath);
  console.log("=====");

  const inputLines = getInputLines(inputpath);

  solve(inputLines);
}

function solve(inputLines: string[]) {
  const dice = new Dice();
  let positions = parseInput(inputLines);
  const scores: [number, number] = [0, 0];
  for (let i = 0; i < 10000; i++) {
    for (const player of [0, 1] as const) {
      const newPosition = playersTurn(positions[player], dice);
      scores[player] += newPosition;
      positions[player] = newPosition;
      if (scores[player] >= 1000) {
        console.log(`player ${player + 1} won!`);
        console.log(`player ${+!player + 1} had ${scores[+!player]} points`);
        console.log(`the dice was rolled ${dice.rolls} times`);
        console.log(`result: ${dice.rolls * scores[+!player]}`);
        return;
      }
    }
  }
}

function parseInput(inputLines: string[]): [number, number] {
  return [
    parseInt(inputLines[0][inputLines[0].length - 1], 10),
    parseInt(inputLines[1][inputLines[1].length - 1], 10),
  ];
}

function playersTurn(position: number, dice: Dice) {
  const rolls = dice.roll() + dice.roll() + dice.roll();

  return ((position + rolls - 1) % 10) + 1;
}

class Dice {
  private val = 0;
  private _rolls = 0;
  public get rolls() {
    return this._rolls;
  }
  public roll(): number {
    this.val = this.val + 1;
    if (this.val > 100) {
      this.val = 1;
    }
    this._rolls++;
    return this.val;
  }
}

main("21_input_example.txt");
main("21_input.txt");
