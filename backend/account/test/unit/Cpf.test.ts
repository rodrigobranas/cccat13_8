import Cpf from "../../src/domain/Cpf";

test.each([
	"95818705552",
	"01234567890",
	"565.486.780-60",
	"147.864.110-00",
])("Deve validar um cpf", function (cpf: string) {
	expect(new Cpf(cpf)).toBeDefined();
});

test.each([
	"958.187.055-00",
	"958.187.055"
])("Não deve validar um cpf", function (cpf: string) {
	expect(() => new Cpf(cpf)).toThrow(new Error("Invalid cpf"));
});
