import AccountGateway from "../gateway/AccountGateway";
import Usecase from "../usecase/Usecase";

export default class AuthenticationDecorator implements Usecase {

	constructor (readonly usecase: Usecase, readonly accountGateway: AccountGateway) {
	}

	async execute(input: any): Promise<any> {
		if (input.token) {
			const output = await this.accountGateway.verifyToken(input.token);
			console.log(output);
			if (!output) throw new Error("Authentication error");
		}
		return this.usecase.execute(input);
	}
	
}