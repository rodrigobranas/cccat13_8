import RideDAO from "../repository/RideRepository";
import RideDAODatabase from "../../infra/repository/RideRepositoryDatabase";
import AccountDAO from "../repository/AccountRepository";
import AccountDAODatabase from "../../infra/repository/AccountRepositoryDatabase";

export default class AcceptRide {

	constructor (
		readonly rideDAO: RideDAO,
		readonly accountDAO: AccountDAO
	) {
	}

	async execute (input: Input) {
		const account = await this.accountDAO.getById(input.driverId);
		if (!account?.isDriver) throw new Error("Account is not from a driver");
		const ride = await this.rideDAO.getById(input.rideId);
		ride.accept(input.driverId);
		const activeRides = await this.rideDAO.getActiveRidesByDriverId(input.driverId);
		if (activeRides.length > 0) throw new Error("Driver is already in another ride");
		await this.rideDAO.update(ride);
	}
	
}

type Input = {
	rideId: string,
	driverId: string
}
