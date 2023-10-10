import RepositoryFactory from "../../application/factory/RepositoryFactory";
import AccountRepository from "../../application/repository/AccountRepository";
import PositionRepository from "../../application/repository/PositionRepository";
import RideRepository from "../../application/repository/RideRepository";
import AccountRepositoryMemory from "../repository/AccountRepositoryMemory";

export default class RepositoryMemoryFactory implements RepositoryFactory {

	createRideRepository(): RideRepository {
		throw new Error("Method not implemented.");
	}

	createAccountRepository(): AccountRepository {
		return new AccountRepositoryMemory();
	}

	createPositionRepository(): PositionRepository {
		throw new Error("Method not implemented.");
	}

}