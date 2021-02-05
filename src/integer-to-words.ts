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

  const actions: Action[] = [
    { match: number <= 9, execute: () => handleLessThan10(number) },
    { match: numberParts.length === 2, execute: () => handleTwoDigits(number) },
    { match: numberParts.length === 3, execute: () => handleThreeDigits(number) },
    { match: numberParts.length.isBetween(4, 6), execute: () => handleThousand(number) },
    { match: numberParts.length.isBetween(7, 9), execute: () => handleMillion(number) },
    { match: numberParts.length.isBetween(10, 12), execute: () => handleBillion(number) },
  ];

  const action = actions.find((action) => action.match);
  const message = action.execute();

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
    const [firstNumber, secondNumber] = [+numberParts.first(1), +numberParts.last(2).join("")];

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
    const factor = 3;

    const hundredsArray = numberParts.last(factor);
    const thousandsArray = numberParts.truncate(factor);
    const firstNumber = +thousandsArray.join("");

    const actionsFirstPart: Action[] = [
      { match: thousandsArray.length === 1 && firstNumber !== 1, execute: () => `${handleLessThan10(firstNumber)} ` },
      {
        match: thousandsArray.length === 2,
        execute: () => `${handleTwoDigits(firstNumber)} `,
      },
      {
        match: thousandsArray.length === 3,
        execute: () => `${handleThreeDigits(firstNumber)} `,
      },
      {
        match: true,
        execute: () => "",
      },
    ];

    const lastNumber = +hundredsArray.map(Number).join("");
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
    const factor = 6;

    const thousandsArray = numberParts.last(factor);
    const millionsArray = numberParts.truncate(factor);
    const firstNumber = +millionsArray.join("");
    const lastNumber = +thousandsArray.map(Number).join("");

    const handleFn = [handleLessThan10, handleTwoDigits, handleThreeDigits];

    const actionsFirstPart: Action[] = [
      {
        match: millionsArray.length === 1 && firstNumber === 1,
        execute: () => `${handleLessThan10(firstNumber)} Milhão`,
      },
      {
        match: [].generate(handleFn.length).includes(millionsArray.length) && firstNumber !== 1,
        execute: () => `${handleFn[millionsArray.length - 1](firstNumber)} Milhões`,
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
    const factor = 9;

    const millionsArray = numberParts.last(factor);
    const billionsArray = numberParts.truncate(factor);
    const firstNumber = +billionsArray.join("");
    const lastNumber = +millionsArray.map(Number).join("");

    const actionsFirstPart: Action[] = [
      {
        match: billionsArray.length === 1 && firstNumber === 1,
        execute: () => `${handleLessThan10(firstNumber)} Bilhão`,
      },
      {
        match: billionsArray.length === 1 && firstNumber !== 1,
        execute: () => `${handleLessThan10(firstNumber)} Bilhões`,
      },
      {
        match: billionsArray.length === 2,
        execute: () => `${handleTwoDigits(firstNumber)} Bilhões`,
      },
      {
        match: billionsArray.length === 3,
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
