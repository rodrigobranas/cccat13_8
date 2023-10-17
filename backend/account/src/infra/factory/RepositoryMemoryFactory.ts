import RepositoryFactory from "../../application/factory/RepositoryFactory";
import AccountRepository from "../../application/repository/AccountRepository";
import AccountRepositoryMemory from "../repository/AccountRepositoryMemory";

export default class RepositoryMemoryFactory implements RepositoryFactory {

	createAccountRepository(): AccountRepository {
		return new AccountRepositoryMemory();
	}

}