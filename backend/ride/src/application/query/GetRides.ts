import Connection from "../../infra/database/Connection";
import Presenter from "../presenter/Presenter";

// Read Model
export default class GetRides {

	constructor (readonly connection: Connection, readonly presenter: Presenter) {
	}

	async execute (input?: Input): Promise<Output> {
		const ridesData = await this.connection.query("select r.*, p.name as passenger_name, p.email as passenger_email, d.name as driver_name, d.email as driver_email from cccat13.ride r join cccat13.account p on (r.passenger_id = p.account_id) left join cccat13.account d on (r.driver_id = d.account_id)", []);
		// DTO
		const output = ridesData.map((rideData: any) => ({
			rideId: rideData.ride_id,
			passengerName: rideData.passenger_name,
			driverEmail: rideData.driver_email
		}));
		return this.presenter.present(output);
	}
}


type Input = {
	pageSize?: number,
	date: Date
}

type Output = {
	rideId: string,
	passengerName: string,
	driverEmail: string
}[]
