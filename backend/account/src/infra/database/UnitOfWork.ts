import pgp from "pg-promise";

import Connection from "./Connection";

export default class UnitOfWork implements Connection {
	connection: any;
	transactions: { statement: string, data: any }[];

	constructor () {
		this.connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		this.transactions = [];
	}

	query(statement: string, data: any, transactional: boolean = false) {
		if (transactional) {
			this.transactions.push({ statement, data });
		} else {
			return this.connection.query(statement, data);
		}
	}

	async executeTransactions () {
		await this.connection.tx(async (t: any) => {
			const transactions = [];
			for (const transaction of this.transactions) {
				transactions.push(await t.query(transaction.statement, transaction.data));
			}
			return t.batch(transactions);
		}).then((data: any) => {
			console.log("commit");
		}).catch((error: any) => {
			console.log("error");
		});
	}

	async close(): Promise<void> {
		await this.connection.$pool.end();
	}

}
