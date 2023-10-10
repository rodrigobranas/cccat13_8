import RideRepository from "../repository/RideRepository";
import AccountRepository from "../repository/AccountRepository";
import Ride from "../../domain/Ride";
import RepositoryFactory from "../factory/RepositoryFactory";

export default class RequestRide {
	rideRepository: RideRepository;
	accountRepository: AccountRepository;

	constructor (readonly repositoryFactory: RepositoryFactory) {
		this.accountRepository = repositoryFactory.createAccountRepository();
		this.rideRepository = repositoryFactory.createRideRepository();
	}

	async execute (input: Input) {
		const account = await this.accountRepository.getById(input.passengerId);
		if (!account?.isPassenger) throw new Error("Account is not from a passenger");
		const activeRides = await this.rideRepository.getActiveRidesByPassengerId(input.passengerId);
		if (activeRides.length > 0) throw new Error("This passenger already has an active ride");
		const ride = Ride.create(input.passengerId, input.from.lat, input.from.long, input.to.lat, input.to.long);
		await this.rideRepository.save(ride);
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
