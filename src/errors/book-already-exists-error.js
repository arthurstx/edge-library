export class BookAlreadyExistsError extends Error {
	constructor() {
		super('Book already exists')
	}
}
