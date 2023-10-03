import { FareCalculatorFactory } from "../../src/domain/FareCalculator";

test("Deve calcular o valor da tarifa com base na distância", function () {
	const distance = 10;
	const fare = FareCalculatorFactory.create(new Date("2021-03-01T10:00:00")).calculate(distance);
	expect(fare).toBe(21);
});
