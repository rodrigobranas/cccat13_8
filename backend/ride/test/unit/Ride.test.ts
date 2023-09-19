import Ride from "../../src/domain/Ride"

test("Deve criar uma ride", function () {
	const ride = Ride.create("", 0, 0, 0, 0);
	expect(ride.rideId).toBeDefined();
	expect(ride.getStatus()).toBe("requested");
});

test("Deve aceitar uma ride", function () {
	const ride = Ride.create("", 0, 0, 0, 0);
	ride.accept("");
	expect(ride.getStatus()).toBe("accepted");
});
