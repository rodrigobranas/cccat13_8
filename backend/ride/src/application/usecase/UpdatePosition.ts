import Position from "../../domain/Position";
import PositionRepository from "../repository/PositionRepository";
import RideRepository from "../repository/RideRepository";

export default class UpdatePosition {

	constructor (readonly rideRepository: RideRepository, readonly positionRepository: PositionRepository) {
	}

	async execute (input: Input) {
		const ride = await this.rideRepository.getById(input.rideId);
		if (ride.getStatus() !== "in_progress") throw new Error();
		const position = Position.create(input.rideId, input.lat, input.long);
		await this.positionRepository.save(position);
	}
	
}

type Input = {
	rideId: string,
	lat: number,
	long: number
}
