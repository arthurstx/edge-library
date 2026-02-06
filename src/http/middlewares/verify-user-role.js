/**
 * @typedef {Object} user
 * @property {string} id
 * @property {string} role
 *
 */
/**
 * @typedef {Object} Context
 * @property {user} user
 */

import { jsonResponse } from 'src/helpers/json'

/**
 * @param {*} env
 * @param {Context} ctx
 */

export function verifyUserRole(request, env, ctx) {
	const { role } = ctx.user

	if (role !== 'admin') {
		return jsonResponse(
			{
				message: 'Access denied. Admins only.',
			},
			403,
		)
	}
}
