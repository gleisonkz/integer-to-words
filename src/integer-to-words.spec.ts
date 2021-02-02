import { integerToWords } from "./integer-to-words";

describe("números do 1 ao 19", () => {
  test("deve retornar Zero para o numero 0", () => {
    expect(integerToWords(0)).toEqual("Zero");
  });

  test("deve retornar Um para o numero 1", () => {
    expect(integerToWords(1)).toEqual("Um");
  });

  test("deve retornar Dois para o numero 2", () => {
    expect(integerToWords(2)).toEqual("Dois");
  });

  test("deve retornar Três para o numero 3", () => {
    expect(integerToWords(3)).toEqual("Três");
  });

  test("deve retornar Quatro para o numero 4", () => {
    expect(integerToWords(4)).toEqual("Quatro");
  });

  test("deve retornar Cinco para o numero 5", () => {
    expect(integerToWords(5)).toEqual("Cinco");
  });

  test("deve retornar Seis para o numero 6", () => {
    expect(integerToWords(6)).toEqual("Seis");
  });

  test("deve retornar Sete para o numero 7", () => {
    expect(integerToWords(7)).toEqual("Sete");
  });

  test("deve retornar Oito para o numero 8", () => {
    expect(integerToWords(8)).toEqual("Oito");
  });

  test("deve retornar Nove para o numero 9", () => {
    expect(integerToWords(9)).toEqual("Nove");
  });

  test("deve retornar Onze para o numero 11", () => {
    expect(integerToWords(11)).toEqual("Onze");
  });

  test("deve retornar Doze para o numero 12", () => {
    expect(integerToWords(12)).toEqual("Doze");
  });

  test("deve retornar Treze para o numero 13", () => {
    expect(integerToWords(13)).toEqual("Treze");
  });

  test("deve retornar Quatorze para o numero 14", () => {
    expect(integerToWords(14)).toEqual("Quatorze");
  });

  test("deve retornar Quinze para o numero 15", () => {
    expect(integerToWords(15)).toEqual("Quinze");
  });

  test("deve retornar Dezesseis para o numero 16", () => {
    expect(integerToWords(16)).toEqual("Dezesseis");
  });

  test("deve retornar Dezessete para o numero 17", () => {
    expect(integerToWords(17)).toEqual("Dezessete");
  });

  test("deve retornar Dezoito para o numero 18", () => {
    expect(integerToWords(18)).toEqual("Dezoito");
  });

  test("deve retornar Dezenove para o numero 19", () => {
    expect(integerToWords(19)).toEqual("Dezenove");
  });
});

describe("Conversão de inteiro para extenso", () => {
  it("deve retornar erro para números negativos", () => {
    expect(() => {
      integerToWords(-1);
    }).toThrow(new RangeError("Number out of range for conversion."));
  });

  test("deve retornar Cento e Vinte para o numero 120", () => {
    expect(integerToWords(120)).toEqual("Cento e Vinte");
  });

  test("deve retornar Mil Cento e Vinte para o numero 1120", () => {
    expect(integerToWords(1120)).toEqual("Mil Cento e Vinte");
  });

  test("deve retornar Dez Mil Cento e Vinte para o numero 10120", () => {
    expect(integerToWords(10120)).toEqual("Dez Mil Cento e Vinte");
  });

  test("deve retornar Cento e Um Mil e Duzentos para o numero 101200", () => {
    expect(integerToWords(10120)).toEqual("Cento e Um Mil e Duzentos");
  });

  test("deve retornar Um Bilhão Trezentos e Quarenta e Dois Milhões para o numero 1342000000", () => {
    expect(integerToWords(1342000000)).toEqual("Um Bilhão Trezentos e Quarenta e Dois Milhões");
  });
});
