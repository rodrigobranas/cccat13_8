// port
export default interface AccountDAO {
	save (account: any): Promise<void>;
	getByEmail (email: string): Promise<any>;
	getById (accountId: string): Promise<any>;
}
