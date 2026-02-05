// router.js

export function createRouter() {
	const routes = []

	function add(method, path, handler) {
		routes.push({ method, path, handler })
	}

	function route(prefix, router) {
		router._routes.forEach((r) => {
			routes.push({
				method: r.method,
				path: prefix + r.path,
				handler: r.handler,
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

		return route.handler(request, env, ctx)
	}

	return {
		get: (path, handler) => add('GET', path, handler),
		post: (path, handler) => add('POST', path, handler),
		route,
		handle,
		_routes: routes,
	}
}
