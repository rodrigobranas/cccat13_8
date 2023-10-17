import AccountRepository from "../repository/AccountRepository";

export default interface RepositoryFactory {
	createAccountRepository(): AccountRepository;
}
