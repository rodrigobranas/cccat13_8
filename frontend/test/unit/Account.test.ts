import Account from "../../src/entity/Account";

test("Deve validar a account", function () {
	const account = new Account("", "", "", "", false, false);
	expect(account.validate().join(", ")).toBe("Invalid name, Invalid email, Invalid cpf");
}); 