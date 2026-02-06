export interface Env {
	d1_edge_library: D1Database
	NODE_ENV: 'dev' | 'production' | 'test'
	JWT_SECRET: string
}
