import CpfValidator from "./CpfValidator";

export default class Account {
	
	constructor (
		public name: string, 
		public email: string, 
		public cpf: string,
		public carPlate: string,
		public isPassenger: boolean,
		public isDriver: boolean
	) {
		}
		
	validate () {
		const errors: string[] = [];
		if (!this.name.match(/[a-zA-Z] [a-zA-Z]+/)) errors.push("Invalid name");
		if (!this.email.match(/^(.+)@(.+)$/)) errors.push("Invalid email");
		const cpfValidator = new CpfValidator();
		if (!cpfValidator.validate(this.cpf)) errors.push("Invalid cpf");
		if (this.isDriver && !this.carPlate.match(/[A-Z]{3}[0-9]{4}/)) errors.push("Invalid plate");
		return errors;
	}
}