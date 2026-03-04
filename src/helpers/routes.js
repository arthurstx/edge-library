import { handleError } from './error.js'

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET,HEAD,POST,PATCH,DELETE,OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, Authorization',
	'Access-Control-Max-Age': '86400',
}

function addCors(response) {
	Object.entries(corsHeaders).forEach(([key, value]) => {
		response.headers.set(key, value)
	})
	return response
}

export function createRouter() {
	const routes = []

	function add(method, path, ...handlers) {
		if (handlers.length === 0) {
			throw new Error('Rota precisa ter pelo menos um handler')
		}

		const paramNames = []
		const regexPath = path.replace(/:([^/]+)/g, (_, paramName) => {
			paramNames.push(paramName)
			return '([^/]+)'
		})

		const regex = new RegExp(`^${regexPath}$`)
		routes.push({ method, path, regex, paramNames, handlers })
	}

	function route(prefix, router) {
		router._routes.forEach((r) => {
			add(r.method, prefix + r.path, ...r.handlers)
		})
	}

	async function handle(request, env, ctx) {
		try {
			const url = new URL(request.url)

			if (request.method === 'OPTIONS') {
				return new Response(null, { status: 204, headers: corsHeaders })
			}

			for (const route of routes) {
				if (route.method !== request.method) continue

				const match = url.pathname.match(route.regex)
				if (!match) continue

				request.params = {}
				route.paramNames.forEach((name, index) => {
					request.params[name] = match[index + 1]
				})

				for (const fn of route.handlers) {
					const res = await fn(request, env, ctx)
					if (res instanceof Response) return addCors(res)
				}
			}

			return addCors(
				new Response(JSON.stringify({ message: 'Not Found' }), {
					status: 404,
					headers: { 'Content-Type': 'application/json' },
				}),
			)
		} catch (err) {
			return addCors(handleError(err, env))
		}
	}

	return {
		get: (path, ...handlers) => add('GET', path, ...handlers),
		post: (path, ...handlers) => add('POST', path, ...handlers),
		patch: (path, ...handlers) => add('PATCH', path, ...handlers),
		delete: (path, ...handlers) => add('DELETE', path, ...handlers),
		route,
		handle,
		_routes: routes,
	}
}
