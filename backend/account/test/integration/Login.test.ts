import AccountRepository from "../../src/application/repository/AccountRepository";
import GetAccount from "../../src/application/usecase/GetAccount";
import Login from "../../src/application/usecase/Login";
import Signup from "../../src/application/usecase/Signup";
import Connection from "../../src/infra/database/Connection";
import PgPromiseAdapter from "../../src/infra/database/PgPromiseAdapter";
import AccountRepositoryDatabase from "../../src/infra/repository/AccountRepositoryDatabase";

let signup: Signup;
let login: Login;
let connection: Connection;
let accountRepository: AccountRepository;

beforeEach(function () {
	connection = new PgPromiseAdapter();
	accountRepository = new AccountRepositoryDatabase(connection);
	signup = new Signup(accountRepository);
	login = new Login(accountRepository);
});

test("Deve fazer um login", async function () {
	const inputSignup: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true,
		password: "123456"
	}
	await signup.execute(inputSignup);
	const inputLogin = {
		email: inputSignup.email,
		password: "123456",
		date: new Date("2023-03-01T10:00:00")
	}
	const outputLogin = await login.execute(inputLogin);
	const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcGYiOiI5NTgxODcwNTU1MiIsImlhdCI6MTY3NzY3NTYwMDAwMCwiZXhwaXJlc0luIjoxMDAwMDAwMDB9.QjbcwNSsQNOD6XfnXhxkLAWLW0KfMywR9anWvxZ9soI";
	expect(outputLogin.token).toBe(token);
});

afterEach(async function () {
	await connection.close();
});
