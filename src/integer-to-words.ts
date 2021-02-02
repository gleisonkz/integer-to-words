import { Action } from "./models/action.model";
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
  const tenToNinety = [
    "Dez",
    "Vinte",
    "Trinta",
    "Quarenta",
    "Cinquenta",
    "Sessenta",
    "Setenta",
    "Oitenta",
    "Noventa",
    "Cem",
  ];
  const oneHundredToNineHundred = [
    "Cento",
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

  const numberParts = [...number.toString()];
  let message = "";

  const actions: Action[] = [
    { match: number <= 9, execute: () => handleLessThan10(number) },
    { match: numberParts.length === 2, execute: () => handleTwoDigits(number) },
    { match: numberParts.length === 3, execute: () => handleThreeDigits(number) },
  ];

  const action = actions.find((action) => action.match);
  message = action.execute();

  function handleLessThan10(number: number) {
    return decimals[number];
  }

  function handleTwoDigits(number: number) {
    const divisibleBy10 = divisibleBy(10, number);
    const numberParts = [...number.toString()];
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

  function handleThreeDigits(number: number) {
    const divisibleBy10 = divisibleBy(10, number);
    const divisibleBy100 = divisibleBy(100, number);
    const numberParts = number.toString().split("");
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

  return message;
}

function divisibleBy(operand: number, number: number): boolean {
  return number % operand === 0;
}

console.log(integerToWords(101));
console.log(integerToWords(102));
console.log(integerToWords(103));
console.log(integerToWords(104));
console.log(integerToWords(105));
console.log(integerToWords(106));
console.log(integerToWords(107));
console.log(integerToWords(108));
console.log(integerToWords(109));
console.log(integerToWords(110));

console.log(integerToWords(111));
console.log(integerToWords(123));
console.log(integerToWords(120));
console.log(integerToWords(240));
console.log(integerToWords(666));
console.log(integerToWords(852));
console.log(integerToWords(888));
console.log(integerToWords(999));

console.log(integerToWords(110));
console.log(integerToWords(120));
console.log(integerToWords(880));
console.log(integerToWords(990));

console.log(integerToWords(100));
console.log(integerToWords(200));
console.log(integerToWords(800));
console.log(integerToWords(900));
