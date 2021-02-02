interface Number {
  isBetween: (min: number, max: number) => boolean;
  toArray: (type: StringConstructor | NumberConstructor) => (string | number)[];
  divisibleBy: (operand: number) => boolean;
}
