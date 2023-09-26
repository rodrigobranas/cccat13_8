import RideDAO from "../repository/RideDAO";
import RideDAODatabase from "../../infra/repository/RideDAODatabase";
import AccountDAO from "../repository/AccountDAO";

export default class GetRide {

	constructor (
		readonly rideDAO: RideDAO,
		readonly accountDAO: AccountDAO
	) {
	}

	async execute (rideId: string) {
		const ride = await this.rideDAO.getById(rideId);
		const account = await this.accountDAO.getById(ride.passengerId);
		return Object.assign(ride, { passenger: account });
	}
	
}
