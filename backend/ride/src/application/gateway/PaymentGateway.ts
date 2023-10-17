export default interface PaymentGateway {
	process (input: any): Promise<any>;
}
