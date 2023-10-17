import RepositoryFactory from "../../application/factory/RepositoryFactory";
import AccountRepository from "../../application/repository/AccountRepository";
import Connection from "../database/Connection";
import AccountRepositoryDatabase from "../repository/AccountRepositoryDatabase";

export default class RepositoryDatabaseFactory implements RepositoryFactory {

	constructor (readonly connection: Connection) {
	}

	createAccountRepository(): AccountRepository {
		return new AccountRepositoryDatabase(this.connection);
	}

}