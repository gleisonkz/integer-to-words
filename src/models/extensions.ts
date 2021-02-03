interface Number {
  isBetween: (min: number, max: number) => boolean;
  toArray: (type: StringConstructor | NumberConstructor) => (string | number)[];
  divisibleBy: (operand: number) => boolean;
}

Number.prototype.isBetween = function (min: number, max: number) {
  return this >= min && this <= max;
};

Number.prototype.toArray = function (type: StringConstructor | NumberConstructor) {
  const stringArray: string[] = [...this.toString()];
  return stringArray.map((c) => type(c));
};

Number.prototype.divisibleBy = function (operand: number) {
  return this % operand === 0;
};
