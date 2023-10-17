export default interface AccountGateway {
	getById (accountId: string): Promise<any>;
	signup (input: any): Promise<any>;
}
