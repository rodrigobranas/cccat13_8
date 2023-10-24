import crypto from "crypto";
import Cpf from "./Cpf";
import Email from "./Email";
import Name from "./Name";
import CarPlate from "./CarPlate";
import { PBKDF2Password, Password, PasswordFactory, PlainPassword, SHA1Password } from "./Password";

export default class Account {

	private constructor (
		public accountId: string,
		readonly name: Name,
		readonly email: Email,
		readonly cpf: Cpf,
		readonly isPassenger: boolean,
		readonly isDriver: boolean,
		readonly carPlate: CarPlate,
		readonly date: Date,
		readonly verificationCode: string,
		readonly password: Password
	) {
	}

	static create (name: string, email: string, cpf: string, isPassenger: boolean, isDriver: boolean, carPlate: string, password: string = "") {
		const accountId = crypto.randomUUID();
		const verificationCode = crypto.randomUUID();
		const date = new Date();
		return new Account(accountId, new Name(name), new Email(email), new Cpf(cpf), isPassenger, isDriver, new CarPlate(carPlate), date, verificationCode, PBKDF2Password.create(password));
	}

	static restore (accountId: string, name: string, email: string, cpf: string, isPassenger: boolean, isDriver: boolean, carPlate: string, date: Date, verificationCode: string, password: string, passwordAlgorithm: string, salt: string) {
		return new Account(accountId, new Name(name), new Email(email), new Cpf(cpf), isPassenger, isDriver, new CarPlate(carPlate), date, verificationCode, PasswordFactory.create(passwordAlgorithm).restore(password, salt));
	}

}
