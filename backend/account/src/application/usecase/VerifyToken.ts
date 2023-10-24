import TokenGenerator from "../../domain/TokenGenerator"

export default class VerifyToken {

	constructor () {
	}

	async execute (input: Input): Promise<Output> {
		const payload = TokenGenerator.verify(input.token);
		if (!payload) throw new Error("Authentication failed");
		return {
			isValid: true,
			cpf: payload.cpf
		}
	}
}

type Input = {
	token: string
}

type Output = {
	isValid: boolean,
	cpf: string
}