import { integerToWords } from "./integer-to-words";

describe("integer to roman numeral converter", () => {
  test("should throw error for negative numbers", () => {
    expect(() => {
      integerToWords(-1);
    }).toThrow(new RangeError("Number out of range for conversion."));
  });

  test("should return Cinco for 5", () => {
    expect(integerToWords(5)).toEqual("Cinco");
  });

  test("should return Onze for 11", () => {
    expect(integerToWords(11)).toEqual("Onze");
  });

  test("should return Vinte e Sete for 27", () => {
    expect(integerToWords(27)).toEqual("Vinte e Sete");
  });

  test("should return Cento e Vinte for 120", () => {
    expect(integerToWords(120)).toEqual("Cento e Vinte");
  });

  test("should return Mil Cento e Vinte for 1120", () => {
    expect(integerToWords(1120)).toEqual("Mil Cento e Vinte");
  });

  test("should return Dez Mil Cento e Vinte for 10120", () => {
    expect(integerToWords(10120)).toEqual("Dez Mil Cento e Vinte");
  });

  test("should return Cento e Um Mil e Duzentos for 101200", () => {
    expect(integerToWords(10120)).toEqual("Cento e Um Mil e Duzentos");
  });

  test("should return Um Bilhão Trezentos e Quarenta e Dois Milhões for 1342000000", () => {
    expect(integerToWords(1342000000)).toEqual("Um Bilhão Trezentos e Quarenta e Dois Milhões");
  });
});
