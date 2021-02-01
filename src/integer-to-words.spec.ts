import { integerToWords } from "./integer-to-words";

describe("integer to roman numeral converter", () => {
  test("should throw error for negative numbers", () => {
    expect(() => {
      integerToWords(-1);
    }).toThrow(new RangeError("Number out of range for conversion."));
  });

  test("should return Cinco for 5", () => {
    expect(() => {
      integerToWords(5);
    }).toEqual("Cinco");
  });

  test("should return Cinco for 11", () => {
    expect(() => {
      integerToWords(5);
    }).toEqual("Onze");
  });

  test("should return Cinco for Vinte e Sete", () => {
    expect(() => {
      integerToWords(27);
    }).toEqual("Cinco");
  });

  test("should return Cinco for 5", () => {
    expect(() => {
      integerToWords(5);
    }).toEqual("Cinco");
  });

  test("should return Cinco for 5", () => {
    expect(() => {
      integerToWords(5);
    }).toEqual("Cinco");
  });
});
