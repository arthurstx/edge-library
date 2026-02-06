export function createRouter() {
	const routes = []

	function add(method, path, ...handlers) {
		if (handlers.length === 0) {
			throw new Error('Rota precisa ter pelo menos um handler')
		}
		routes.push({ method, path, handlers })
	}

	function route(prefix, router) {
		router._routes.forEach((r) => {
			routes.push({
				method: r.method,
				path: prefix + r.path,
				handlers: r.handlers,
			})
		})
	}

	async function handle(request, env, ctx) {
		const url = new URL(request.url)
		const route = routes.find((r) => r.method === request.method && r.path === url.pathname)

		if (!route) {
			return new Response(JSON.stringify({ message: 'Not Found' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' },
			})
		}

		// Executa middlewares + handler final
		for (const fn of route.handlers) {
			const res = await fn(request, env, ctx)
			if (res instanceof Response) {
				// Se algum middleware retornar Response, interrompe
				return res
			}
		}
	}

	return {
		get: (path, ...handlers) => add('GET', path, ...handlers),
		post: (path, ...handlers) => add('POST', path, ...handlers),
		route,
		handle,
		_routes: routes,
	}
}
