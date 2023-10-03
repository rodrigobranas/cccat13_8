import crypto from "crypto";
import Coord from "./Coord";
import Status, { StatusFactory } from "./Status";
import Position from "./Position";
import DistanceCalculator from "./DistanceCalculator";
import { FareCalculatorFactory } from "./FareCalculator";

export default class Ride {
	driverId?: string;
	status: Status;

	private constructor (
		readonly rideId: string,
		readonly passengerId: string,
		status: string,
		readonly from: Coord,
		readonly to: Coord,
		readonly date: Date,
		private distance: number,
		private fare: number
	) {
		this.status = StatusFactory.create(this, status);
	}

	static create (passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number) {
		const rideId = crypto.randomUUID();
		const status = "requested";
		const date = new Date();
		return new Ride(rideId, passengerId, status, new Coord(fromLat, fromLong), new Coord(toLat, toLong), date, 0, 0);
	}

	static restore (rideId: string, passengerId: string, driverId: string, status: string, fromLat: number, fromLong: number, toLat: number, toLong: number, date: Date, distance: number, fare: number) {
		const ride = new Ride(rideId, passengerId, status, new Coord(fromLat, fromLong), new Coord(toLat, toLong), date, distance, fare);
		ride.driverId = driverId;
		return ride;
	}

	accept (driverId: string) {
		this.driverId = driverId;
		this.status.accept();
	}

	start () {
		this.status.start();
	}
	
	finish (positions: Position[]) {
		this.distance = 0;
		for (const [index, position] of positions.entries()) {
			const nextPosition = positions[index + 1];
			if (!nextPosition) break;
			this.distance += DistanceCalculator.calculate(position.coord, nextPosition.coord);
		}
		const fareCalculator = FareCalculatorFactory.create(this.date);
		this.fare = fareCalculator.calculate(this.distance);
		this.status.finish();
	}

	getStatus () {
		return this.status.value;
	}

	getDistance () {
		return this.distance;
	}

	getFare () {
		return this.fare;
	}

}
