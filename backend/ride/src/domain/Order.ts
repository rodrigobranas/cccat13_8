import Cpf from "./Cpf";
import Email from "./Email";
import Name from "./Name";

export default class Order {
	name?: Name;
	email?: Email;
	cpf?: Cpf;

	constructor (name: string, email: string, cpf: string) {
		const errors = [];
		try {
			this.name = new Name(name);
		} catch (e: any) {
			errors.push(e.message);
		}
		try {
			this.email = new Email(email);
		} catch (e: any) {
			errors.push(e.message);
		}
		try {
			this.cpf = new Cpf(cpf);
		} catch (e: any) {
			errors.push(e.message);
		}
		if (errors.length > 0) {
			throw new Error(errors.join(", "));
		}
	}
}
