export default interface AccountGateway {
	getById (accountId: string): Promise<any>;
	signup (input: any): Promise<any>;
	verifyToken (token: string): Promise<any>;
}
