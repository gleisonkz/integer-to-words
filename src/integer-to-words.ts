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

  const idn = ["Mil", "Milhão", "Bilhão"];

  const numberParts = number.toString().split("");
  let message = "";

  if (number <= 9) {
    message = handleLessThan10(number);
  } else if (numberParts.length === 2) {
    message = handleTwoDigits(number);
  } else if (numberParts.length === 3) {
    message = handleThreeDigits(number);
  }

  function handleLessThan10(number: number) {
    return decimals[number];
  }

  function handleTwoDigits(number: number) {
    const noReminder = number % 10 === 0;
    const numberParts = number.toString().split("");

    let newMessage = "";

    if (!noReminder && number <= 19) {
      newMessage = elevenToNineTeen[+numberParts[1] - 1];
    }

    if (noReminder) {
      newMessage = tenToNinety[number / 10 - 1];
    } else if (!noReminder && number > 19) {
      newMessage = `${tenToNinety[+numberParts[0] - 1]} e ${decimals[+numberParts[1]]}`;
    }

    return newMessage;
  }

  function handleThreeDigits(number: number) {
    const noReminderBy10 = number % 10 === 0;
    const numberParts = number.toString().split("");
    let newMessage = "";

    if (!noReminderBy10) {
      console.log(number);
    }

    if (noReminderBy10) {
      const noReminderBy100 = number % 100 === 0;

      if (noReminderBy100) {
        newMessage = oneHundredToNineHundred[number / 100 - 1];
      } else {
        const newArr = [+numberParts[0], +(numberParts[1] + numberParts[2])];
        newMessage = `${oneHundredToNineHundred[newArr[0] - 1]} e ${tenToNinety[newArr[1] / 10 - 1]}`;
      }
    }
    if (!noReminderBy10) {
      const newArr = [+numberParts[0], +(numberParts[1] + numberParts[2])];
      const [firstNumber, secondNumber] = newArr;

      newMessage = `${oneHundredToNineHundred[firstNumber - 1]} e ${
        secondNumber < 10 ? handleLessThan10(secondNumber) : handleTwoDigits(secondNumber)
      }`;
    }
    return newMessage;
  }

  return message;
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
console.log(integerToWords(111));
console.log(integerToWords(123));
console.log(integerToWords(240));
console.log(integerToWords(666));
console.log(integerToWords(852));
console.log(integerToWords(369));
console.log(integerToWords(999));

console.log(integerToWords(110));
console.log(integerToWords(550));
console.log(integerToWords(660));
console.log(integerToWords(770));
console.log(integerToWords(880));
console.log(integerToWords(990));

console.log(integerToWords(100));
console.log(integerToWords(200));
console.log(integerToWords(300));
console.log(integerToWords(400));
console.log(integerToWords(500));
console.log(integerToWords(600));
console.log(integerToWords(700));
console.log(integerToWords(800));
console.log(integerToWords(900));

console.log(integerToWords(10));
console.log(integerToWords(20));
console.log(integerToWords(30));
console.log(integerToWords(40));
console.log(integerToWords(50));
console.log(integerToWords(60));
console.log(integerToWords(70));
console.log(integerToWords(80));
console.log(integerToWords(90));

console.log(integerToWords(21));
console.log(integerToWords(32));
console.log(integerToWords(43));
console.log(integerToWords(54));
console.log(integerToWords(65));
console.log(integerToWords(76));
console.log(integerToWords(87));
console.log(integerToWords(98));
console.log(integerToWords(99));
