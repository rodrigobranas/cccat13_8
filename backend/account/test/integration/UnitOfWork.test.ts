import PgPromiseAdapter from "../../src/infra/database/PgPromiseAdapter";
import UnitOfWork from "../../src/infra/database/UnitOfWork";

test("Deve testar o Unit of Work", async function () {
	const connection = new UnitOfWork();
	await connection.query("insert into cccat13.unit_of_work (name) values ($1)", ["a"], true);
	await connection.query("insert into cccat13.unit_of_work (id) values ($1)", ["b"], true);
	connection.executeTransactions();
	await connection.close();
});
