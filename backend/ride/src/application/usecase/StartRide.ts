import RideDAO from "../repository/RideDAO";

export default class StartRide {

	constructor (
		readonly rideDAO: RideDAO
	) {
	}

	async execute (input: Input) {
		const ride = await this.rideDAO.getById(input.rideId);
		ride.start();
		await this.rideDAO.update(ride);
	}
	
}

type Input = {
	rideId: string
}
