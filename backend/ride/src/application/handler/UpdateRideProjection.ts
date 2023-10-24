import Connection from "../../infra/database/Connection";
import AccountGateway from "../gateway/AccountGateway";
import RideRepository from "../repository/RideRepository";

export default class UpdateRideProjection {

	constructor (readonly rideRepository: RideRepository, readonly accountGateway: AccountGateway, readonly connection: Connection) {
	}

	async execute (input: Input) {
		console.log("updateRideProjection", input.rideId);
		const ride = await this.rideRepository.getById(input.rideId);
		const account = await this.accountGateway.getById(ride.passengerId);
		if (!ride || !account) throw new Error();
		const rideProjection = {
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
				accountId: account.accountId,
				name: account.name,
				email: account.email,
				cpf: account.cpf,
				carPlate: account.carPlate,
				isPassenger: account.isPassenger,
				isDriver: account.isDriver
			}
		};
		await this.connection.query("insert into cccat13.ride_projection (ride_id, passenger_name, passenger_email) values ($1, $2, $3)", [rideProjection.rideId, rideProjection.passenger.name, rideProjection.passenger.email]);
	}

}

type Input = {
	rideId: string,
	fare: number
}
