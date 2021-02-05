import { Action } from "./models/action.model";
import "./models/extensions";

export function integerToWords(number: number): string {
  if (number < 0) throw RangeError("Number out of range for conversion.");

  const onesPlace = ["Zero", "Um", "Dois", "Três", "Quatro", "Cinco", "Seis", "Sete", "Oito", "Nove"];
  const tensPlace = ["Onze", "Doze", "Treze", "Quatorze", "Quinze", "Dezesseis", "Dezessete", "Dezoito", "Dezenove"];

  const exactTensPlace = [
    "Dez",
    "Vinte",
    "Trinta",
    "Quarenta",
    "Cinquenta",
    "Sessenta",
    "Setenta",
    "Oitenta",
    "Noventa",
  ];

  const hundredsPlace = [
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
    { match: number <= 9, execute: () => handleOnes(number) },
    { match: numberParts.length === 2, execute: () => handleTens(number) },
    { match: numberParts.length === 3, execute: () => handleHundreds(number) },
    { match: numberParts.length.isBetween(4, 6), execute: () => handleThousands(number) },
    { match: numberParts.length.isBetween(7, 9), execute: () => handleMillions(number) },
    { match: numberParts.length.isBetween(10, 12), execute: () => handleBillions(number) },
  ];

  const action = actions.find((action) => action.match);
  const message = action.execute();

  function handleOnes(number: number): string {
    return onesPlace[number];
  }

  function handleTens(number: number): string {
    const divisibleBy10 = number.divisibleBy(10);
    const numberParts = number.toArray(String);

    const actions: Action[] = [
      { match: !divisibleBy10 && number <= 19, execute: () => tensPlace[+numberParts[1] - 1] },
      {
        match: !divisibleBy10 && number > 19,
        execute: () => `${exactTensPlace[+numberParts[0] - 1]} e ${onesPlace[+numberParts[1]]}`,
      },
      { match: true, execute: () => exactTensPlace[number / 10 - 1] },
    ];

    const action = actions.find((action) => action.match);
    const newMessage = action.execute();
    return newMessage;
  }

  function handleHundreds(number: number): string {
    const divisibleBy10 = number.divisibleBy(10);
    const divisibleBy100 = number.divisibleBy(100);
    const numberParts = number.toArray(String) as string[];
    const [firstNumber, secondNumber] = [+numberParts.first(1), +numberParts.last(2).join("")];

    const actions: Action[] = [
      { match: divisibleBy10 && divisibleBy100, execute: () => hundredsPlace[number / 100 - 1](number) },
      {
        match: divisibleBy10,
        execute: () => `${hundredsPlace[firstNumber - 1](number)} e ${exactTensPlace[secondNumber / 10 - 1]}`,
      },
      {
        match: !divisibleBy10,
        execute: () =>
          `${hundredsPlace[firstNumber - 1](number)} e ${
            secondNumber < 10 ? handleOnes(secondNumber) : handleTens(secondNumber)
          }`,
      },
    ];

    const action = actions.find((action) => action.match);
    const newMessage = action.execute();
    return newMessage;
  }

  function handleThousands(number: number): string {
    const numberParts = number.toArray(String) as string[];
    const factor = 3;

    const hundredsArray = numberParts.last(factor);
    const thousandsArray = numberParts.truncate(factor);
    const firstNumber = +thousandsArray.join("");

    const actionsFirstPart: Action[] = [
      { match: thousandsArray.length === 1 && firstNumber !== 1, execute: () => `${handleOnes(firstNumber)} ` },
      {
        match: thousandsArray.length === 2,
        execute: () => `${handleTens(firstNumber)} `,
      },
      {
        match: thousandsArray.length === 3,
        execute: () => `${handleHundreds(firstNumber)} `,
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
        execute: () => `e ${handleOnes(lastNumber)}`,
      },
      {
        match: lastNumberParts.length === 2,
        execute: () => `e ${handleTens(lastNumber)}`,
      },
      {
        match: lastNumberParts.length === 3,
        execute: () => handleHundreds(lastNumber),
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

  function handleMillions(number: number): string {
    const numberParts = number.toArray(String) as string[];
    const factor = 6;

    const thousandsArray = numberParts.last(factor);
    const millionsArray = numberParts.truncate(factor);
    const firstNumber = +millionsArray.join("");
    const lastNumber = +thousandsArray.map(Number).join("");

    const handleFn = [handleOnes, handleTens, handleHundreds];

    const actionsFirstPart: Action[] = [
      {
        match: millionsArray.length === 1 && firstNumber === 1,
        execute: () => `${handleOnes(firstNumber)} Milhão`,
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
    return `${firstPartMessage} ${handleThousands(lastNumber)}`.trim();
  }

  function handleBillions(number: number): string {
    const numberParts = number.toArray(String) as string[];
    const factor = 9;

    const millionsArray = numberParts.last(factor);
    const billionsArray = numberParts.truncate(factor);
    const firstNumber = +billionsArray.join("");
    const lastNumber = +millionsArray.map(Number).join("");

    const actionsFirstPart: Action[] = [
      {
        match: billionsArray.length === 1 && firstNumber === 1,
        execute: () => `${handleOnes(firstNumber)} Bilhão`,
      },
      {
        match: billionsArray.length === 1 && firstNumber !== 1,
        execute: () => `${handleOnes(firstNumber)} Bilhões`,
      },
      {
        match: billionsArray.length === 2,
        execute: () => `${handleTens(firstNumber)} Bilhões`,
      },
      {
        match: billionsArray.length === 3,
        execute: () => `${handleHundreds(firstNumber)} Bilhões`,
      },
      {
        match: true,
        execute: () => "",
      },
    ];

    const actionFirstPart = actionsFirstPart.find((action) => action.match);
    const firstPartMessage = actionFirstPart.execute();
    return `${firstPartMessage} ${handleMillions(lastNumber)}`.trim();
  }
  return message;
}
