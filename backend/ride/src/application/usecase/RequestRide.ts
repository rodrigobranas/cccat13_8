import RideDAO from "../repository/RideDAO";
import RideDAODatabase from "../../infra/repository/RideDAODatabase";
import AccountDAO from "../repository/AccountDAO";
import AccountDAODatabase from "../../infra/repository/AccountDAODatabase";
import Ride from "../../domain/Ride";

export default class RequestRide {

	constructor (
		readonly rideDAO: RideDAO,
		readonly accountDAO: AccountDAO
	) {
	}

	async execute (input: Input) {
		const account = await this.accountDAO.getById(input.passengerId);
		if (!account?.isPassenger) throw new Error("Account is not from a passenger");
		const activeRides = await this.rideDAO.getActiveRidesByPassengerId(input.passengerId);
		if (activeRides.length > 0) throw new Error("This passenger already has an active ride");
		const ride = Ride.create(input.passengerId, input.from.lat, input.from.long, input.to.lat, input.to.long);
		await this.rideDAO.save(ride);
		return {
			rideId: ride.rideId
		};
	}
	
}

type Input = {
	passengerId: string,
	from: {
		lat: number,
		long: number
	},
	to: {
		lat: number,
		long: number
	}
}
