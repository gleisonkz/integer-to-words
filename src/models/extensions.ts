interface Number {
  isBetween: (min: number, max: number) => boolean;
  toArray: (type: StringConstructor | NumberConstructor) => (string | number)[];
}

Number.prototype.isBetween = function (min: number, max: number) {
  console.log(this);

  return this >= min && this <= max;
};

Number.prototype.toArray = function (type: StringConstructor | NumberConstructor) {
  const stringArray: string[] = [...this.toString()];
  return stringArray.map((c) => type(c));
};
