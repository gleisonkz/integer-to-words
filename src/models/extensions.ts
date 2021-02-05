interface Number {
  isBetween: (min: number, max: number) => boolean;
  toArray: (type: StringConstructor | NumberConstructor) => (string | number)[];
  divisibleBy: (operand: number) => boolean;
}

interface Array<T> {
  generate: (size: number) => T[];
  last: (quantity: number) => T[];
  first: (quantity: number) => T[];
  truncate: (lastDigits: number) => T[];
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

Array.prototype.generate = function (size: number) {
  return [...Array(size)].map((_, i) => i + 1);
};

Array.prototype.last = function (quantity: number) {
  return this.slice(quantity * -1);
};

Array.prototype.first = function (quantity: number) {
  return this.slice(0, quantity);
};

Array.prototype.truncate = function (lastDigits: number) {
  return this.slice(0, this.length - lastDigits);
};
