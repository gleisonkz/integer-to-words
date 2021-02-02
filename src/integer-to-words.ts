import { Action } from "./models/action.model";

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

export function integerToWords(number: number): string {
  if (number < 0) throw RangeError("Number out of range for conversion.");

  const decimals = ["Zero", "Um", "Dois", "Três", "Quatro", "Cinco", "Seis", "Sete", "Oito", "Nove"];

  const elevenToNineTeen = [
    "Onze",
    "Doze",
    "Treze",
    "Quatorze",
    "Quinze",
    "Dezesseis",
    "Dezessete",
    "Dezoito",
    "Dezenove",
  ];
  const tenToNinety = ["Dez", "Vinte", "Trinta", "Quarenta", "Cinquenta", "Sessenta", "Setenta", "Oitenta", "Noventa"];
  const oneHundredToNineHundred = [
    number.divisibleBy(100) ? "Cem" : "Cento",
    "Duzentos",
    "Trezentos",
    "Quatrocentos",
    "Quinhentos",
    "Seiscentos",
    "Setecentos",
    "Oitocentos",
    "Novecentos",
  ];

  const bigUnits = ["Mil", "Milhão", "Bilhão"];

  const numberParts = number.toArray(String);
  let message = "";

  const actions: Action[] = [
    { match: number <= 9, execute: () => handleLessThan10(number) },
    { match: numberParts.length === 2, execute: () => handleTwoDigits(number) },
    { match: numberParts.length === 3, execute: () => handleThreeDigits(number) },
    { match: numberParts.length.isBetween(4, 6), execute: () => handleThousand(number) },
  ];

  const action = actions.find((action) => action.match);
  message = action.execute();

  function handleLessThan10(number: number): string {
    return decimals[number];
  }

  function handleTwoDigits(number: number): string {
    const divisibleBy10 = number.divisibleBy(10);
    const numberParts = number.toArray(String);
    let newMessage = "";

    const actions: Action[] = [
      { match: !divisibleBy10 && number <= 19, execute: () => elevenToNineTeen[+numberParts[1] - 1] },
      {
        match: !divisibleBy10 && number > 19,
        execute: () => `${tenToNinety[+numberParts[0] - 1]} e ${decimals[+numberParts[1]]}`,
      },
      { match: true, execute: () => tenToNinety[number / 10 - 1] },
    ];

    const action = actions.find((action) => action.match);
    newMessage = action.execute();
    return newMessage;
  }

  function handleThreeDigits(number: number): string {
    const divisibleBy10 = number.divisibleBy(10);
    const divisibleBy100 = number.divisibleBy(100);
    const numberParts = number.toArray(String) as string[];
    const [firstNumber, secondNumber] = [+numberParts[0], +(numberParts[1] + numberParts[2])];
    let newMessage = "";

    const actions: Action[] = [
      { match: divisibleBy10 && divisibleBy100, execute: () => oneHundredToNineHundred[number / 100 - 1] },
      {
        match: divisibleBy10,
        execute: () => `${oneHundredToNineHundred[firstNumber - 1]} e ${tenToNinety[secondNumber / 10 - 1]}`,
      },
      {
        match: !divisibleBy10,
        execute: () =>
          `${oneHundredToNineHundred[firstNumber - 1]} e ${
            secondNumber < 10 ? handleLessThan10(secondNumber) : handleTwoDigits(secondNumber)
          }`,
      },
    ];

    const action = actions.find((action) => action.match);
    newMessage = action.execute();
    return newMessage;
  }

  function handleThousand(number: number): string {
    const numberParts = number.toArray(String);
    console.log(numberParts);
    const newA = numberParts.slice(Math.max(numberParts.length - 5, 1));
    console.log(newA);

    // console.log(numberParts);

    return "";
  }

  return message;
}

console.log(integerToWords(100));
console.log(integerToWords(9999));
console.log(integerToWords(20000));
console.log(integerToWords(420000));
