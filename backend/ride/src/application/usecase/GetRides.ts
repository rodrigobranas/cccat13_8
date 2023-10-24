import AccountGateway from "../gateway/AccountGateway";
import RideRepository from "../repository/RideRepository";

export default class GetRides {

	constructor (readonly rideRepository: RideRepository, readonly accountGateway: AccountGateway) {
	}

	async execute () {
		const rides = await this.rideRepository.list();
		const output: any = [];
		for (const ride of rides) {
			const passenger = await this.accountGateway.getById(ride.passengerId);
			if (!ride || !passenger) throw new Error();
			let driver;
			if (ride.driverId) {
				driver = await this.accountGateway.getById(ride.driverId);
			}
			output.push({
				rideId: ride.rideId,
				passengerId: ride.passengerId,
				driverId: ride.driverId,
				fromLat: ride.from.getLat(),
				fromLong: ride.from.getLong(),
				toLat: ride.to.getLat(),
				toLong: ride.to.getLong(),
				date: ride.date,
				status: ride.getStatus(),
				distance: ride.getDistance(),
				fare: ride.getFare(),
				passenger: {
					accountId: passenger.accountId,
					name: passenger.name,
					email: passenger.email,
					cpf: passenger.cpf,
					carPlate: passenger.carPlate,
					isPassenger: passenger.isPassenger,
					isDriver: passenger.isDriver
				},
				driver: {
					accountId: driver?.accountId,
					name: driver?.name,
					email: driver?.email,
					cpf: driver?.cpf,
					carPlate: driver?.carPlate,
					isPassenger: driver?.isPassenger,
					isDriver: driver?.isDriver
				}
			});
		}
		return output;
	}
	
}

type Output = {
	rideId: string,
	passengerId: string,
	driverId: string,
	fromLat: number,
	fromLong: number,
	toLat: number,
	toLong: number,
	status: string,
	distance: number,
	fare: number,
	passenger: {
		accountId: string,
		name: string,
		email: string,
		cpf: string,
		carPlate: string,
		isPassenger: boolean,
		isDriver: boolean
	}
}[];
