export interface Env {
	d1_edge_library: D1Database
	kv_edge_library: KVNamespace
	NODE_ENV: 'dev' | 'production' | 'test'
	JWT_SECRET: string
}
