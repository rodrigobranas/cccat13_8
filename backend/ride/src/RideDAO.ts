export default interface RideDAO {
	save (ride: any): Promise<void>;
	update (ride: any): Promise<void>;
	getById (rideId: string): Promise<any>;
	getActiveRidesByPassengerId (passengerId: string): Promise<any>;
	getActiveRidesByDriverId (driverId: string): Promise<any>;
}
