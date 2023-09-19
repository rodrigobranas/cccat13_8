import express from "express";
import pgp from "pg-promise";
const app = express();

app.use(express.json());

app.post("/signup", async function (req, res) {
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		const accountId = crypto.randomUUID();
		const verificationCode = crypto.randomUUID();
		const date = new Date();
		const [existingAccount] = await connection.query("select * from cccat13.account where email = $1", [req.body.email]);
		if (existingAccount) throw new Error("Account already exists");
		if (!req.body.name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error("Invalid name");
		if (!req.body.email.match(/^(.+)@(.+)$/)) throw new Error("Invalid email");
		if (req.body.isDriver && !req.body.carPlate.match(/[A-Z]{3}[0-9]{4}/)) throw new Error("Invalid plate");
		await connection.query("insert into cccat13.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, date, is_verified, verification_code) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", [accountId, req.body.name, req.body.email, req.body.cpf, req.body.carPlate, !!req.body.isPassenger, !!req.body.isDriver, date, false, verificationCode]);
		await connection.$pool.end();
		res.json({
			accountId
		});
});

app.listen(3000);
