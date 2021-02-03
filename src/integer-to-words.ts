import { Action } from "./models/action.model";
import "./models/extensions";

export function integerToWords(number: number): string {
  if (number < 0) throw RangeError("Number out of range for conversion.");

  const zeroToNine = ["Zero", "Um", "Dois", "Três", "Quatro", "Cinco", "Seis", "Sete", "Oito", "Nove"];

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
    (number: number) => (number.divisibleBy(100) ? "Cem" : "Cento"),
    () => "Duzentos",
    () => "Trezentos",
    () => "Quatrocentos",
    () => "Quinhentos",
    () => "Seiscentos",
    () => "Setecentos",
    () => "Oitocentos",
    () => "Novecentos",
  ];

  const numberParts = number.toArray(String);
  let message = "";

  const actions: Action[] = [
    { match: number <= 9, execute: () => handleLessThan10(number) },
    { match: numberParts.length === 2, execute: () => handleTwoDigits(number) },
    { match: numberParts.length === 3, execute: () => handleThreeDigits(number) },
    { match: numberParts.length.isBetween(4, 6), execute: () => handleThousand(number) },
    { match: numberParts.length.isBetween(7, 9), execute: () => handleMillion(number) },
    { match: numberParts.length.isBetween(10, 12), execute: () => handleBillion(number) },
  ];

  const action = actions.find((action) => action.match);
  message = action.execute();

  function handleLessThan10(number: number): string {
    return zeroToNine[number];
  }

  function handleTwoDigits(number: number): string {
    const divisibleBy10 = number.divisibleBy(10);
    const numberParts = number.toArray(String);

    const actions: Action[] = [
      { match: !divisibleBy10 && number <= 19, execute: () => elevenToNineTeen[+numberParts[1] - 1] },
      {
        match: !divisibleBy10 && number > 19,
        execute: () => `${tenToNinety[+numberParts[0] - 1]} e ${zeroToNine[+numberParts[1]]}`,
      },
      { match: true, execute: () => tenToNinety[number / 10 - 1] },
    ];

    const action = actions.find((action) => action.match);
    const newMessage = action.execute();
    return newMessage;
  }

  function handleThreeDigits(number: number): string {
    const divisibleBy10 = number.divisibleBy(10);
    const divisibleBy100 = number.divisibleBy(100);
    const numberParts = number.toArray(String) as string[];
    const [firstNumber, secondNumber] = [+numberParts[0], +(numberParts[1] + numberParts[2])];

    const actions: Action[] = [
      { match: divisibleBy10 && divisibleBy100, execute: () => oneHundredToNineHundred[number / 100 - 1](number) },
      {
        match: divisibleBy10,
        execute: () => `${oneHundredToNineHundred[firstNumber - 1](number)} e ${tenToNinety[secondNumber / 10 - 1]}`,
      },
      {
        match: !divisibleBy10,
        execute: () =>
          `${oneHundredToNineHundred[firstNumber - 1](number)} e ${
            secondNumber < 10 ? handleLessThan10(secondNumber) : handleTwoDigits(secondNumber)
          }`,
      },
    ];

    const action = actions.find((action) => action.match);
    const newMessage = action.execute();
    return newMessage;
  }

  function handleThousand(number: number): string {
    const numberParts = number.toArray(String) as string[];
    const lastThreeParts = numberParts.slice(Math.max(numberParts.length - 3, 1));
    const firstTwoParts = numberParts.slice(0, numberParts.length - 3);
    const firstNumber = +numberParts.slice(0, numberParts.length - 3).join("");

    const actionsFirstPart: Action[] = [
      { match: firstTwoParts.length === 1 && firstNumber !== 1, execute: () => `${handleLessThan10(firstNumber)} ` },
      {
        match: firstTwoParts.length === 2,
        execute: () => `${handleTwoDigits(firstNumber)} `,
      },
      {
        match: firstTwoParts.length === 3,
        execute: () => `${handleThreeDigits(firstNumber)} `,
      },
      {
        match: true,
        execute: () => "",
      },
    ];

    const lastNumber = +lastThreeParts.map(Number).join("");
    const lastNumberParts = lastNumber.toArray(String);

    const actionsLastPart: Action[] = [
      {
        match: lastNumberParts.length === 1 && lastNumber !== 0,
        execute: () => `e ${handleLessThan10(lastNumber)}`,
      },
      {
        match: lastNumberParts.length === 2,
        execute: () => `e ${handleTwoDigits(lastNumber)}`,
      },
      {
        match: lastNumberParts.length === 3,
        execute: () => handleThreeDigits(lastNumber),
      },
      {
        match: true,
        execute: () => "",
      },
    ];

    const actionFirstPart = actionsFirstPart.find((action) => action.match);
    const actionLastPart = actionsLastPart.find((action) => action.match);
    const firstPartMessage = actionFirstPart.execute();
    const LastPartMessage = actionLastPart.execute();
    const newMessage = `${firstPartMessage}Mil ${LastPartMessage}`.trim();

    return newMessage;
  }

  function handleMillion(number: number): string {
    const numberParts = number.toArray(String) as string[];
    const lastThreeParts = numberParts.slice(Math.max(numberParts.length - 6, 1));
    const firstTwoParts = numberParts.slice(0, numberParts.length - 6);
    const firstNumber = +numberParts.slice(0, numberParts.length - 6).join("");
    const lastNumber = +lastThreeParts.map(Number).join("");

    const actionsFirstPart: Action[] = [
      {
        match: firstTwoParts.length === 1 && firstNumber === 1,
        execute: () => `${handleLessThan10(firstNumber)} Milhão`,
      },
      {
        match: firstTwoParts.length === 1 && firstNumber !== 1,
        execute: () => `${handleLessThan10(firstNumber)} Milhões`,
      },
      {
        match: firstTwoParts.length === 2,
        execute: () => `${handleTwoDigits(firstNumber)} Milhões`,
      },
      {
        match: firstTwoParts.length === 3,
        execute: () => `${handleThreeDigits(firstNumber)} Milhões`,
      },
      {
        match: true,
        execute: () => "",
      },
    ];

    const actionFirstPart = actionsFirstPart.find((action) => action.match);
    const firstPartMessage = actionFirstPart.execute();
    return `${firstPartMessage} ${handleThousand(lastNumber)}`.trim();
  }

  function handleBillion(number: number): string {
    const numberParts = number.toArray(String) as string[];
    const lastThreeParts = numberParts.slice(Math.max(numberParts.length - 9, 1));
    const firstTwoParts = numberParts.slice(0, numberParts.length - 9);
    const firstNumber = +numberParts.slice(0, numberParts.length - 9).join("");
    const lastNumber = +lastThreeParts.map(Number).join("");

    const actionsFirstPart: Action[] = [
      {
        match: firstTwoParts.length === 1 && firstNumber === 1,
        execute: () => `${handleLessThan10(firstNumber)} Bilhão`,
      },
      {
        match: firstTwoParts.length === 1 && firstNumber !== 1,
        execute: () => `${handleLessThan10(firstNumber)} Bilhões`,
      },
      {
        match: firstTwoParts.length === 2,
        execute: () => `${handleTwoDigits(firstNumber)} Bilhões`,
      },
      {
        match: firstTwoParts.length === 3,
        execute: () => `${handleThreeDigits(firstNumber)} Bilhões`,
      },
      {
        match: true,
        execute: () => "",
      },
    ];

    const actionFirstPart = actionsFirstPart.find((action) => action.match);
    const firstPartMessage = actionFirstPart.execute();
    return `${firstPartMessage} ${handleMillion(lastNumber)}`.trim();
  }

  return message;
}
