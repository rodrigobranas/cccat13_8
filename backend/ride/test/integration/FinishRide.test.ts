import AcceptRide from "../../src/application/usecase/AcceptRide";
import Connection from "../../src/infra/database/Connection";
import GetRide from "../../src/application/usecase/GetRide";
import PgPromiseAdapter from "../../src/infra/database/PgPromiseAdapter";
import RequestRide from "../../src/application/usecase/RequestRide";
import RideDAO from "../../src/application/repository/RideRepository";
import RideDAODatabase from "../../src/infra/repository/RideRepositoryDatabase";
import StartRide from "../../src/application/usecase/StartRide";
import UpdatePosition from "../../src/application/usecase/UpdatePosition";
import PositionRepository from "../../src/application/repository/PositionRepository";
import PositionRepositoryDatabase from "../../src/infra/repository/PositionRepositoryDatabase";
import FinishRide from "../../src/application/usecase/FinishRide";
import RepositoryDatabaseFactory from "../../src/infra/factory/RepositoryDatabaseFactory";
import AccountGateway from "../../src/application/gateway/AccountGateway";
import AccountGatewayHttp from "../../src/infra/gateway/AccountGatewayHttp";
import AxiosAdapter from "../../src/infra/http/AxiosAdapter";
import GetRides from "../../src/application/query/GetRides";
import CsvPresenter from "../../src/infra/presenter/CsvPresenter";
import HTMLPresenter from "../../src/infra/presenter/HTMLPresenter";

let accountGateway: AccountGateway;
let requestRide: RequestRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let updatePosition: UpdatePosition;
let finishRide: FinishRide;
let getRide: GetRide;
let connection: Connection;
let rideDAO: RideDAO;
let positionRepository: PositionRepository;

beforeEach(function () {
	connection = new PgPromiseAdapter();
	rideDAO = new RideDAODatabase(connection);
	positionRepository = new PositionRepositoryDatabase(connection);
	accountGateway = new AccountGatewayHttp(new AxiosAdapter());
	const repositoryFactory = new RepositoryDatabaseFactory(connection);
	requestRide = new RequestRide(repositoryFactory, accountGateway);
	acceptRide = new AcceptRide(repositoryFactory, accountGateway);
	updatePosition = new UpdatePosition(rideDAO, positionRepository);
	finishRide = new FinishRide(rideDAO, positionRepository);
	startRide = new StartRide(rideDAO);
	getRide = new GetRide(rideDAO, accountGateway);
});

test("Deve solicitar, aceitar, iniciar e atualizar a posição uma corrida", async function () {
	const inputSignupPassenger: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}
	const outputSignupPassenger = await accountGateway.signup(inputSignupPassenger);
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
	const outputSignupDriver = await accountGateway.signup(inputSignupDriver);
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
	// const getRides = new GetRides(rideDAO, accountGateway);
	const getRides = new GetRides(connection, new CsvPresenter());
	const rides = await getRides.execute();
	console.log(rides);
});

afterEach(async function () {
	await connection.close();
});
