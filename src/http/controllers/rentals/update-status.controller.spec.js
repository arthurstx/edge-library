import { test, expect } from 'vitest'
import { SELF } from 'cloudflare:test'
import { createRental } from 'src/http/test/helpers/create-rental'

test('list history user rentals : Integration', async () => {
	const { rental, adminToken } = await createRental()

	const id = rental.id

	const response = await SELF.fetch(`http://worker/rental/${id}/return`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${adminToken}`,
		},
		body: JSON.stringify({
			userId: rental.userId,
		}),
	})

	expect(response.status).toBe(200)
})
