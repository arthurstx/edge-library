const PBKDF2_ITERATIONS = 100_000
const HASH_ALGORITHM = 'SHA-256'
const SALT_LENGTH = 16 // bytes
const KEY_LENGTH = 256 // bits

/**
 * @param {ArrayBuffer} buffer
 * @returns {string}
 */
function toBase64(buffer) {
	return btoa(String.fromCharCode(...new Uint8Array(buffer)))
}

/**
 * @param {string} base64
 * @returns {Uint8Array}
 */
function fromBase64(base64) {
	return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
}

/**
 * @param {Uint8Array} a
 * @param {Uint8Array} b
 * @returns {boolean}
 */
function timingSafeEqual(a, b) {
	if (a.byteLength !== b.byteLength) return false

	let diff = 0
	for (let i = 0; i < a.byteLength; i++) {
		diff |= a[i] ^ b[i]
	}
	return diff === 0
}

/**
 * Gera um password hash seguro usando PBKDF2 (Cloudflare Workers native).
 *
 * @param {string} password - Senha em texto puro
 * @returns {Promise<string>} Hash no formato:
 *   pbkdf2$sha256$iterations$saltBase64$hashBase64
 */
export async function hashPassword(password) {
	const encoder = new TextEncoder()
	const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH))

	const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits'])

	const hashBuffer = await crypto.subtle.deriveBits(
		{
			name: 'PBKDF2',
			salt,
			iterations: PBKDF2_ITERATIONS,
			hash: HASH_ALGORITHM,
		},
		keyMaterial,
		KEY_LENGTH,
	)

	return ['pbkdf2', HASH_ALGORITHM.toLowerCase(), PBKDF2_ITERATIONS, toBase64(salt), toBase64(hashBuffer)].join('$')
}

/**
 * Verifica se a senha corresponde ao hash salvo.
 *
 * @param {string} password - Senha informada no login
 * @param {string} storedHash - Hash salvo no banco
 * @returns {Promise<boolean>} true se a senha for válida
 */
export async function verifyPassword(password, storedHash) {
	const parts = storedHash.split('$')

	if (parts.length !== 5) {
		throw new Error('Invalid password hash format')
	}

	const [method, hashName, iterationsStr, saltB64, hashB64] = parts

	if (method !== 'pbkdf2') {
		throw new Error(`Unsupported hash method: ${method}`)
	}

	const iterations = Number(iterationsStr)
	const salt = fromBase64(saltB64)
	const stored = fromBase64(hashB64)

	const encoder = new TextEncoder()
	const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits'])

	const hashBuffer = await crypto.subtle.deriveBits(
		{
			name: 'PBKDF2',
			salt,
			iterations,
			hash: hashName.toUpperCase(),
		},
		keyMaterial,
		KEY_LENGTH,
	)

	return timingSafeEqual(new Uint8Array(hashBuffer), stored)
}
