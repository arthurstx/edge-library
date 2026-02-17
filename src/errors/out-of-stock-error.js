export class OutOfStockError extends Error {
	constructor() {
		super('Book is out of stock')
	}
}
