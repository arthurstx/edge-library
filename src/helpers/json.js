/**
 * Cria uma Response JSON para Cloudflare Workers
 * @param {any} body - O corpo da resposta
 * @param {number} [status=200] - Status HTTP (200-599)
 * @param {Record<string, string>} [headers={}] - Headers extras
 * @returns {Response}
 */
export function jsonResponse(body, status = 200, headers = {}) {
	if (typeof status !== 'number' || status < 200 || status > 599) {
		console.warn(`Status inválido: ${status}. Usando 200.`)
		status = 200
	}

	return new Response(JSON.stringify(body), {
		status,
		headers: {
			'Content-Type': 'application/json',
			...headers,
		},
	})
}
