import Position from "../../domain/Position";

export default interface PositionRepository {
	save (position: Position): Promise<void>;
	getByRideId (rideId: string): Promise<Position[]>;
}
