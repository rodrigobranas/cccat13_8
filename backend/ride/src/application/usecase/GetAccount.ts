import AccountDAO from "../repository/AccountDAO";

export default class GetAccount {

	constructor (readonly accountDAO: AccountDAO) {
	}

	async execute (accountId: string) {
		const account = await this.accountDAO.getById(accountId);
		return account;
	}
}
