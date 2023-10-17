import RepositoryFactory from "../../application/factory/RepositoryFactory";
import PositionRepository from "../../application/repository/PositionRepository";
import RideRepository from "../../application/repository/RideRepository";
import Connection from "../database/Connection";
import PositionRepositoryDatabase from "../repository/PositionRepositoryDatabase";
import RideRepositoryDatabase from "../repository/RideRepositoryDatabase";

export default class RepositoryDatabaseFactory implements RepositoryFactory {

	constructor (readonly connection: Connection) {
	}

	createRideRepository(): RideRepository {
		return new RideRepositoryDatabase(this.connection);
	}

	createPositionRepository(): PositionRepository {
		return new PositionRepositoryDatabase(this.connection);
	}

}