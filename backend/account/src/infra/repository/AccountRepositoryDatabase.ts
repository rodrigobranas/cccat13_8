import Account from "../../domain/Account";
import Connection from "../database/Connection";
import AccountRepository from "../../application/repository/AccountRepository";

export default class AccountRepositoryDatabase implements AccountRepository {

	constructor (readonly connection: Connection) {
	}

	async save (account: Account) {
		await this.connection.query("insert into cccat13.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, date, is_verified, verification_code, password, password_algorithm, salt) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)", [account.accountId, account.name.getValue(), account.email.getValue(), account.cpf.getValue(), account.carPlate.getValue(), !!account.isPassenger, !!account.isDriver, account.date, false, account.verificationCode, account.password.value, account.password.algorithm, account.password.salt], true);
	}

	async getByEmail (email: string) {
		const [accountData] = await this.connection.query("select * from cccat13.account where email = $1", [email], false);
		if (!accountData) return;
		return Account.restore(accountData.account_id, accountData.name, accountData.email, accountData.cpf, accountData.is_passenger, accountData.is_driver, accountData.car_plate, accountData.date, accountData.verification_code, accountData.password, accountData.password_algorithm, accountData.salt);
	}

	async getById (accountId: string) {
		const [accountData] = await this.connection.query("select * from cccat13.account where account_id = $1", [accountId], false);
		if (!accountData) return;
		return Account.restore(accountData.account_id, accountData.name, accountData.email, accountData.cpf, accountData.is_passenger, accountData.is_driver, accountData.car_plate, accountData.date, accountData.verification_code, accountData.password, accountData.password_algorithm, accountData.salt);
	}
}