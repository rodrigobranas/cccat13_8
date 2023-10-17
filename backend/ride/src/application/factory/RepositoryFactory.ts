import PositionRepository from "../repository/PositionRepository";
import RideRepository from "../repository/RideRepository";

export default interface RepositoryFactory {
	createRideRepository(): RideRepository;
	createPositionRepository(): PositionRepository;
}
