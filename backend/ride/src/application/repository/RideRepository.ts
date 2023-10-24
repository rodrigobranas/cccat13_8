import Ride from "../../domain/Ride";

export default interface RideRepository {
	save (ride: Ride): Promise<void>;
	update (ride: Ride): Promise<void>;
	getById (rideId: string): Promise<Ride>;
	getActiveRidesByPassengerId (passengerId: string): Promise<any>;
	getActiveRidesByDriverId (driverId: string): Promise<any>;
	list (): Promise<Ride[]>;
}
