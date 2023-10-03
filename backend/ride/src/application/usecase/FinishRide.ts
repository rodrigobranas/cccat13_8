import PositionRepository from "../repository/PositionRepository";
import RideDAO from "../repository/RideRepository";

export default class FinishRide {

	constructor (
		readonly rideDAO: RideDAO,
		readonly positionRepository: PositionRepository
	) {
	}

	async execute (input: Input) {
		const ride = await this.rideDAO.getById(input.rideId);
		const positions = await this.positionRepository.getByRideId(input.rideId);
		ride.finish(positions);
		await this.rideDAO.update(ride);
	}
	
}

type Input = {
	rideId: string
}
