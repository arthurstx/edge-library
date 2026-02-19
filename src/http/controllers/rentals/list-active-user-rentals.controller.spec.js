import { test, expect } from 'vitest'
import { SELF } from 'cloudflare:test'
import { createRental } from 'src/http/test/helpers/create-rental'

test('list active user rentals : Integration', async () => {
	const { rental, userToken, user } = await createRental()

	const response = await SELF.fetch('http://worker/rental/active', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${userToken}`,
		},
	})

	const { rental: returnedRental } = await response.json()

	expect(returnedRental).toEqual(
		expect.arrayContaining([
			expect.objectContaining({
				id: rental.id,
				user_id: user.id,
				book_id: rental.bookId,
			}),
		]),
	)
	expect(response.status).toBe(200)
})
