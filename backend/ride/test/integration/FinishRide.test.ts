import AcceptRide from "../../src/application/usecase/AcceptRide";
import AccountDAO from "../../src/application/repository/AccountRepository";
import AccountDAODatabase from "../../src/infra/repository/AccountRepositoryDatabase";
import Connection from "../../src/infra/database/Connection";
import GetRide from "../../src/application/usecase/GetRide";
import PgPromiseAdapter from "../../src/infra/database/PgPromiseAdapter";
import RequestRide from "../../src/application/usecase/RequestRide";
import RideDAO from "../../src/application/repository/RideRepository";
import RideDAODatabase from "../../src/infra/repository/RideRepositoryDatabase";
import Signup from "../../src/application/usecase/Signup";
import StartRide from "../../src/application/usecase/StartRide";
import UpdatePosition from "../../src/application/usecase/UpdatePosition";
import PositionRepository from "../../src/application/repository/PositionRepository";
import PositionRepositoryDatabase from "../../src/infra/repository/PositionRepositoryDatabase";
import FinishRide from "../../src/application/usecase/FinishRide";

let signup: Signup;
let requestRide: RequestRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let updatePosition: UpdatePosition;
let finishRide: FinishRide;
let getRide: GetRide;
let connection: Connection;
let rideDAO: RideDAO;
let accountDAO: AccountDAO;
let positionRepository: PositionRepository;

beforeEach(function () {
	connection = new PgPromiseAdapter();
	rideDAO = new RideDAODatabase(connection);
	accountDAO = new AccountDAODatabase(connection);
	positionRepository = new PositionRepositoryDatabase(connection);
	signup = new Signup(accountDAO);
	requestRide = new RequestRide(rideDAO, accountDAO);
	acceptRide = new AcceptRide(rideDAO, accountDAO);
	updatePosition = new UpdatePosition(rideDAO, positionRepository);
	finishRide = new FinishRide(rideDAO, positionRepository);
	startRide = new StartRide(rideDAO);
	getRide = new GetRide(rideDAO, accountDAO);
});

test("Deve solicitar, aceitar, iniciar e atualizar a posição uma corrida", async function () {
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
	const inputUpdatePosition1 = {
		rideId: outputRequestRide.rideId,
		lat: -27.584905257808835,
		long: -48.545022195325124
	};
	await updatePosition.execute(inputUpdatePosition1);
	const inputUpdatePosition2 = {
		rideId: outputRequestRide.rideId,
		lat: -27.496887588317275,
		long: -48.522234807851476
	};
	await updatePosition.execute(inputUpdatePosition2);
	const inputFinishRide = {
		rideId: outputRequestRide.rideId
	};
	await finishRide.execute(inputFinishRide);
	const outputGetRide = await getRide.execute(outputRequestRide.rideId);
	expect(outputGetRide.status).toBe("completed");
	expect(outputGetRide.distance).toBe(10);
	expect(outputGetRide.fare).toBe(21);
});

afterEach(async function () {
	await connection.close();
});
