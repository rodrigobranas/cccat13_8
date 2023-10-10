import RepositoryFactory from "../../application/factory/RepositoryFactory";
import AccountRepository from "../../application/repository/AccountRepository";
import PositionRepository from "../../application/repository/PositionRepository";
import RideRepository from "../../application/repository/RideRepository";
import Connection from "../database/Connection";
import AccountRepositoryDatabase from "../repository/AccountRepositoryDatabase";
import PositionRepositoryDatabase from "../repository/PositionRepositoryDatabase";
import RideRepositoryDatabase from "../repository/RideRepositoryDatabase";

export default class RepositoryDatabaseFactory implements RepositoryFactory {

	constructor (readonly connection: Connection) {
	}

	createRideRepository(): RideRepository {
		return new RideRepositoryDatabase(this.connection);
	}

	createAccountRepository(): AccountRepository {
		return new AccountRepositoryDatabase(this.connection);
	}

	createPositionRepository(): PositionRepository {
		return new PositionRepositoryDatabase(this.connection);
	}

}