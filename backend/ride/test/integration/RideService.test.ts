import AcceptRide from "../../src/application/usecase/AcceptRide";
import AccountDAO from "../../src/application/repository/AccountDAO";
import AccountDAODatabase from "../../src/infra/repository/AccountDAODatabase";
import Connection from "../../src/infra/database/Connection";
import GetRide from "../../src/application/usecase/GetRide";
import PgPromiseAdapter from "../../src/infra/database/PgPromiseAdapter";
import RequestRide from "../../src/application/usecase/RequestRide";
import RideDAO from "../../src/application/repository/RideDAO";
import RideDAODatabase from "../../src/infra/repository/RideDAODatabase";
import Signup from "../../src/application/usecase/Signup";
import StartRide from "../../src/application/usecase/StartRide";

let signup: Signup;
let requestRide: RequestRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let getRide: GetRide;
let connection: Connection;
let rideDAO: RideDAO;
let accountDAO: AccountDAO;

beforeEach(function () {
	connection = new PgPromiseAdapter();
	rideDAO = new RideDAODatabase(connection);
	accountDAO = new AccountDAODatabase(connection);
	signup = new Signup(accountDAO);
	requestRide = new RequestRide(rideDAO, accountDAO);
	acceptRide = new AcceptRide(rideDAO, accountDAO);
	startRide = new StartRide(rideDAO);
	getRide = new GetRide(rideDAO);
});

test("Deve solicitar uma corrida e receber a rideId", async function () {
	const inputSignup: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}
	const outputSignup = await signup.execute(inputSignup);
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		from: {
			lat: -27.584905257808835,
			long: -48.545022195325124
		},
		to: {
			lat: -27.496887588317275,
			long: -48.522234807851476
		}
	}
	const outputRequestRide = await requestRide.execute(inputRequestRide);
	expect(outputRequestRide.rideId).toBeDefined();
});

test("Deve solicitar e consultar uma corrida", async function () {
	const inputSignup: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}
	const outputSignup = await signup.execute(inputSignup);
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		from: {
			lat: -27.584905257808835,
			long: -48.545022195325124
		},
		to: {
			lat: -27.496887588317275,
			long: -48.522234807851476
		}
	}
	const outputRequestRide = await requestRide.execute(inputRequestRide);
	const outputGetRide = await getRide.execute(outputRequestRide.rideId);
	expect(outputGetRide.getStatus()).toBe("requested");
	expect(outputGetRide.passengerId).toBe(outputSignup.accountId);
	expect(outputGetRide.fromLat).toBe(inputRequestRide.from.lat);
	expect(outputGetRide.fromLong).toBe(inputRequestRide.from.long);
	expect(outputGetRide.toLat).toBe(inputRequestRide.to.lat);
	expect(outputGetRide.toLong).toBe(inputRequestRide.to.long);
	expect(outputGetRide.date).toBeDefined();
});

test("Deve solicitar uma corrida e aceitar uma corrida", async function () {
	const inputSignupPassenger: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}
	const outputSignupPassenger = await signup.execute(inputSignupPassenger);
	const inputRequestRide = {
		passengerId: outputSignupPassenger.accountId,
		from: {
			lat: -27.584905257808835,
			long: -48.545022195325124
		},
		to: {
			lat: -27.496887588317275,
			long: -48.522234807851476
		}
	}
	const outputRequestRide = await requestRide.execute(inputRequestRide);
	const inputSignupDriver: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		carPlate: "AAA9999",
		isDriver: true
	}
	const outputSignupDriver = await signup.execute(inputSignupDriver);
	const inputAcceptRide = {
		rideId: outputRequestRide.rideId,
		driverId: outputSignupDriver.accountId
	}
	await acceptRide.execute(inputAcceptRide);
	const outputGetRide = await getRide.execute(outputRequestRide.rideId);
	expect(outputGetRide.getStatus()).toBe("accepted");
	expect(outputGetRide.driverId).toBe(outputSignupDriver.accountId);
});

test("Caso uma corrida seja solicitada por uma conta que não seja de passageiro deve lançar um erro", async function () {
	const inputSignup: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		carPlate: "AAA9999",
		isDriver: true
	}
	const outputSignup = await signup.execute(inputSignup);
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		from: {
			lat: -27.584905257808835,
			long: -48.545022195325124
		},
		to: {
			lat: -27.496887588317275,
			long: -48.522234807851476
		}
	}
	await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("Account is not from a passenger"));
});

test("Caso uma corrida seja solicitada por um passageiro e ele já tenha outra corrida em andamento lançar um erro", async function () {
	const inputSignup: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}
	const outputSignup = await signup.execute(inputSignup);
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		from: {
			lat: -27.584905257808835,
			long: -48.545022195325124
		},
		to: {
			lat: -27.496887588317275,
			long: -48.522234807851476
		}
	}
	await requestRide.execute(inputRequestRide);
	await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("This passenger already has an active ride"));
});

test("Não deve aceitar uma corrida se a account não for driver", async function () {
	const inputSignupPassenger: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}
	const outputSignupPassenger = await signup.execute(inputSignupPassenger);
	const inputRequestRide = {
		passengerId: outputSignupPassenger.accountId,
		from: {
			lat: -27.584905257808835,
			long: -48.545022195325124
		},
		to: {
			lat: -27.496887588317275,
			long: -48.522234807851476
		}
	}
	const outputRequestRide = await requestRide.execute(inputRequestRide);
	const inputSignupDriver: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}
	const outputSignupDriver = await signup.execute(inputSignupDriver);
	const inputAcceptRide = {
		rideId: outputRequestRide.rideId,
		driverId: outputSignupDriver.accountId
	}
	await expect(() => acceptRide.execute(inputAcceptRide)).rejects.toThrow("Account is not from a driver");
});

test("Não deve aceitar uma corrida se o status da corrida não for requested", async function () {
	const inputSignupPassenger: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}
	const outputSignupPassenger = await signup.execute(inputSignupPassenger);
	const inputRequestRide = {
		passengerId: outputSignupPassenger.accountId,
		from: {
			lat: -27.584905257808835,
			long: -48.545022195325124
		},
		to: {
			lat: -27.496887588317275,
			long: -48.522234807851476
		}
	}
	const outputRequestRide = await requestRide.execute(inputRequestRide);
	const inputSignupDriver: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		carPlate: "AAA9999",
		isDriver: true
	}
	const outputSignupDriver = await signup.execute(inputSignupDriver);
	const inputAcceptRide = {
		rideId: outputRequestRide.rideId,
		driverId: outputSignupDriver.accountId
	}
	await acceptRide.execute(inputAcceptRide);
	await expect(() => acceptRide.execute(inputAcceptRide)).rejects.toThrow(new Error("The ride is not requested"));
});

test("Não deve aceitar uma corrida se o motorista já tiver outra corrida em andamento", async function () {
	const inputSignupPassenger1: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}
	const outputSignupPassenger1 = await signup.execute(inputSignupPassenger1);
	const inputRequestRide1 = {
		passengerId: outputSignupPassenger1.accountId,
		from: {
			lat: -27.584905257808835,
			long: -48.545022195325124
		},
		to: {
			lat: -27.496887588317275,
			long: -48.522234807851476
		}
	}
	const inputSignupPassenger2: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}
	const outputSignupPassenger2 = await signup.execute(inputSignupPassenger2);
	const inputRequestRide2 = {
		passengerId: outputSignupPassenger2.accountId,
		from: {
			lat: -27.584905257808835,
			long: -48.545022195325124
		},
		to: {
			lat: -27.496887588317275,
			long: -48.522234807851476
		}
	}
	const outputRequestRide1 = await requestRide.execute(inputRequestRide1);
	const outputRequestRide2 = await requestRide.execute(inputRequestRide2);

	const inputSignupDriver: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		carPlate: "AAA9999",
		isDriver: true
	}
	const outputSignupDriver = await signup.execute(inputSignupDriver);
	const inputAcceptRide1 = {
		rideId: outputRequestRide1.rideId,
		driverId: outputSignupDriver.accountId
	}
	const inputAcceptRide2 = {
		rideId: outputRequestRide2.rideId,
		driverId: outputSignupDriver.accountId
	}
	await acceptRide.execute(inputAcceptRide1);
	await expect(() => acceptRide.execute(inputAcceptRide2)).rejects.toThrow("Driver is already in another ride");
});

test("Deve solicitar, aceitar e iniciar uma corrida", async function () {
	const inputSignupPassenger: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}
	const outputSignupPassenger = await signup.execute(inputSignupPassenger);
	const inputRequestRide = {
		passengerId: outputSignupPassenger.accountId,
		from: {
			lat: -27.584905257808835,
			long: -48.545022195325124
		},
		to: {
			lat: -27.496887588317275,
			long: -48.522234807851476
		}
	}
	const outputRequestRide = await requestRide.execute(inputRequestRide);
	const inputSignupDriver: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		carPlate: "AAA9999",
		isDriver: true
	}
	const outputSignupDriver = await signup.execute(inputSignupDriver);
	const inputAcceptRide = {
		rideId: outputRequestRide.rideId,
		driverId: outputSignupDriver.accountId
	}
	await acceptRide.execute(inputAcceptRide);
	const inputStartRide = {
		rideId: outputRequestRide.rideId,
	};
	await startRide.execute(inputStartRide);
	const outputGetRide = await getRide.execute(outputRequestRide.rideId);
	expect(outputGetRide.getStatus()).toBe("in_progress");
	expect(outputGetRide.driverId).toBe(outputSignupDriver.accountId);
});

afterEach(async function () {
	await connection.close();
});
