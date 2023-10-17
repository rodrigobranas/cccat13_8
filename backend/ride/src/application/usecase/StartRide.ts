import RideRepository from "../repository/RideRepository";

export default class StartRide {

	constructor (readonly rideRepository: RideRepository) {
	}

	async execute (input: Input) {
		const ride = await this.rideRepository.getById(input.rideId);
		ride.start();
		await this.rideRepository.update(ride);
	}
	
}

type Input = {
	rideId: string
}
