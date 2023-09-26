import Account from "../../entity/Account";

export default interface RideGateway {
	signup (input: Account): Promise<any>;
	requestRide (input: any): Promise<any>;
	getRide (rideId: string): Promise<any>;
}
