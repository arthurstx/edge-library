import { test, expect } from 'vitest'
import { SELF } from 'cloudflare:test'
import { createRental } from 'src/http/test/helpers/create-rental'

test('list all rentals : Integration', async () => {
	const { rental, adminToken, user } = await createRental()

	const response = await SELF.fetch('http://worker/rental?page=1', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${adminToken}`,
		},
	})

	const { rentals: returnedRentals } = await response.json()

	expect(returnedRentals).toEqual(
		expect.arrayContaining([
			expect.objectContaining({
				id: rental.id,
				user: {
					userId: user.id,
					name: user.name,
				},
			}),
		]),
	)
	expect(response.status).toBe(200)
})

test('list all rentals with query filter : Integration', async () => {
	const { adminToken, user } = await createRental()

	// Using the created user's name as a search query
	const response = await SELF.fetch(`http://worker/rental?page=1&query=${user.name}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${adminToken}`,
		},
	})

	const { rentals: returnedRentals } = await response.json()

	expect(returnedRentals).toEqual(
		expect.arrayContaining([
			expect.objectContaining({
				user: {
					userId: user.id,
					name: user.name,
				},
			}),
		]),
	)
	expect(response.status).toBe(200)
})

test('list all rentals fails for non-admin user : Integration', async () => {
	const { userToken } = await createRental()

	const response = await SELF.fetch('http://worker/rental?page=1', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${userToken}`,
		},
	})

	expect(response.status).toBe(403)
})
