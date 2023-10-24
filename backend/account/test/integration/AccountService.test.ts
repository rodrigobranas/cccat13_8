// driver
import AccountDAO from "../../src/infra/repository/AccountRepositoryDatabase";
import sinon from "sinon";
import MailerGateway from "../../src/infra/gateway/MailerGateway";
import AccountDAOMemory from "../../src/infra/repository/AccountRepositoryMemory";
import Account from "../../src/domain/Account";
import Signup from "../../src/application/usecase/Signup";
import GetAccount from "../../src/application/usecase/GetAccount";
import Connection from "../../src/infra/database/Connection";
import PgPromiseAdapter from "../../src/infra/database/PgPromiseAdapter";
import AccountDAODatabase from "../../src/infra/repository/AccountRepositoryDatabase";
import UnitOfWork from "../../src/infra/database/UnitOfWork";

let signup: Signup;
let getAccount: GetAccount;
let connection: UnitOfWork;
let accountDAO: AccountDAO;

beforeEach(function () {
	connection = new UnitOfWork();
	accountDAO = new AccountDAODatabase(connection);
	signup = new Signup(accountDAO);
	getAccount = new GetAccount(accountDAO);
});

test.only("Deve criar um passageiro", async function () {
	const input: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}
	const output = await signup.execute(input);
	connection.executeTransactions();
	const account = await getAccount.execute(output.accountId);
	expect(account?.accountId).toBeDefined();
	expect(account?.name).toBe(input.name);
	expect(account?.email).toBe(input.email);
	expect(account?.cpf).toBe(input.cpf);
});

test("Não deve criar um passageiro com cpf inválido", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705500",
		isPassenger: true,
		isDriver: false,
		carPlate: ""
	}
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid cpf"));
});

test("Não deve criar um passageiro com nome inválido", async function () {
	const input = {
		name: "John",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true,
		isDriver: false,
		carPlate: ""
	}
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid name"));
});

test("Não deve criar um passageiro com email inválido", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@`,
		cpf: "95818705552",
		isPassenger: true,
		isDriver: false,
		carPlate: ""
	}
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid email"));
});

test("Não deve criar um passageiro com conta existente", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true,
		isDriver: false,
		carPlate: ""
	}
	await signup.execute(input)
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Account already exists"));
});

test("Deve criar um motorista", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		carPlate: "AAA9999",
		isPassenger: false,
		isDriver: true
	}
	const output = await signup.execute(input);
	expect(output.accountId).toBeDefined();
});

test("Não deve criar um motorista com place do carro inválida", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		carPlate: "AAA999",
		isDriver: true,
		isPassenger: false
	}
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid plate"));
});

test("Deve criar um passageiro com stub", async function () {
	const input: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}
	const stubSave = sinon.stub(AccountDAO.prototype, "save").resolves();
	const stubGetByEmail = sinon.stub(AccountDAO.prototype, "getByEmail").resolves();
	const output = await signup.execute(input);
	input.account_id = output.accountId;
	const stubGetById = sinon.stub(AccountDAO.prototype, "getById").resolves(Account.create(input.name, input.email, input.cpf, input.isPassenger, false, ""));
	const account = await getAccount.execute(output.accountId);
	expect(account?.accountId).toBeDefined();
	expect(account?.name).toBe(input.name);
	expect(account?.email).toBe(input.email);
	expect(account?.cpf).toBe(input.cpf);
	stubSave.restore();
	stubGetByEmail.restore();
	stubGetById.restore();
});

test("Deve criar um passageiro com spy", async function () {
	const spy = sinon.spy(MailerGateway.prototype, "send");
	const input: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}
	const stubSave = sinon.stub(AccountDAO.prototype, "save").resolves();
	const stubGetByEmail = sinon.stub(AccountDAO.prototype, "getByEmail").resolves();
	const output = await signup.execute(input);
	input.account_id = output.accountId;
	const stubGetById = sinon.stub(AccountDAO.prototype, "getById").resolves(input);
	expect(spy.calledOnce).toBeTruthy();
	expect(spy.calledWith(input.email, "Verification")).toBeTruthy();
	spy.restore();
	stubSave.restore();
	stubGetByEmail.restore();
	stubGetById.restore();
});

test("Deve criar um passageiro com mock", async function () {
	const input: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}
	const mock = sinon.mock(MailerGateway.prototype);
	mock.expects("send").withArgs(input.email, "Verification").calledOnce;
	const mockAccountDAO = sinon.mock(AccountDAO.prototype);
	mockAccountDAO.expects("save").resolves();
	mockAccountDAO.expects("getByEmail").resolves();
	const output = await signup.execute(input);
	input.account_id = output.accountId;
	mockAccountDAO.expects("getById").resolves(input);
	mock.verify();
	mock.restore();
});

test("Deve criar um passageiro com fake", async function () {
	const accountDAO = new AccountDAOMemory();
	const input: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true,
		isDriver: false,
		carPlate: ""
	}
	const signup = new Signup(accountDAO);
	const output = await signup.execute(input);
	const getAccount = new GetAccount(accountDAO);
	const account = await getAccount.execute(output.accountId);
	expect(account?.accountId).toBeDefined();
	expect(account?.name).toBe(input.name);
	expect(account?.email).toBe(input.email);
	expect(account?.cpf).toBe(input.cpf);
});

afterEach(async function () {
	await connection.close();
});
