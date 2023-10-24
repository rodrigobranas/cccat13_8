import AcceptRide from "../../src/application/usecase/AcceptRide";
import Connection from "../../src/infra/database/Connection";
import GetRide from "../../src/application/usecase/GetRide";
import PgPromiseAdapter from "../../src/infra/database/PgPromiseAdapter";
import RequestRide from "../../src/application/usecase/RequestRide";
import RideRepository from "../../src/application/repository/RideRepository";
import RideRepositoryDatabase from "../../src/infra/repository/RideRepositoryDatabase";
import StartRide from "../../src/application/usecase/StartRide";
import RepositoryDatabaseFactory from "../../src/infra/factory/RepositoryDatabaseFactory";
import AccountGateway from "../../src/application/gateway/AccountGateway";
import AccountGatewayHttp from "../../src/infra/gateway/AccountGatewayHttp";
import AxiosAdapter from "../../src/infra/http/AxiosAdapter";
import Usecase from "../../src/application/usecase/Usecase";
import AuthenticationDecorator from "../../src/application/decorator/AuthenticationDecorator";
import FetchAdapter from "../../src/infra/http/FetchAdapter";

let accountGateway: AccountGateway;
let requestRide: Usecase;
let getRide: GetRide;
let connection: Connection;
let rideRepository: RideRepository;

beforeEach(function () {
	connection = new PgPromiseAdapter();
	rideRepository = new RideRepositoryDatabase(connection);
	accountGateway = new AccountGatewayHttp(new AxiosAdapter());
	const repositoryFactory = new RepositoryDatabaseFactory(connection);
	requestRide = new AuthenticationDecorator(new RequestRide(repositoryFactory, accountGateway), accountGateway);
	getRide = new GetRide(rideRepository, accountGateway);
});

test.only("Deve solicitar uma corrida e receber a rideId", async function () {
	const inputSignup: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}
	const outputSignup = await accountGateway.signup(inputSignup);
	const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcGYiOiI5NTgxODcwNTU1MiIsImlhdCI6MTY3NzY3NTYwMDAwMCwiZXhwaXJlc0luIjoxMDAwMDAwMDB9.QjbcwNSsQNOD6XfnXhxkLAWLW0KfMywR9anWvxZ9soI";
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		from: {
			lat: -27.584905257808835,
			long: -48.545022195325124
		},
		to: {
			lat: -27.496887588317275,
			long: -48.522234807851476
		},
		token
	}
	const outputRequestRide = await requestRide.execute(inputRequestRide);
	expect(outputRequestRide.rideId).toBeDefined();
});

afterEach(async function () {
	await connection.close();
});
