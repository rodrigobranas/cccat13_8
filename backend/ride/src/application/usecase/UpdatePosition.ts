import Position from "../../domain/Position";
import PositionRepository from "../repository/PositionRepository";
import RideDAO from "../repository/RideRepository";

export default class UpdatePosition {

	constructor (
		readonly rideDAO: RideDAO,
		readonly positionRepository: PositionRepository
	) {
	}

	async execute (input: Input) {
		const ride = await this.rideDAO.getById(input.rideId);
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
